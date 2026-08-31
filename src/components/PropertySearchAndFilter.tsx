import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Home, 
  Building, 
  Trees, 
  SlidersHorizontal, 
  RotateCcw, 
  PlusCircle, 
  DollarSign, 
  BedDouble, 
  ArrowUpDown, 
  LayoutGrid, 
  Map 
} from 'lucide-react';
import { FilterState, PropertyCategory } from '../types';

interface PropertySearchAndFilterProps {
  filter: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onResetFilter: () => void;
  onOpenAddProperty: () => void;
  categoryCounts: {
    All: number;
    House: number;
    Apartment: number;
    Plot: number;
  };
}

export const PropertySearchAndFilter: React.FC<PropertySearchAndFilterProps> = ({
  filter,
  onFilterChange,
  onResetFilter,
  onOpenAddProperty,
  categoryCounts,
}) => {
  const categories: { label: 'All' | PropertyCategory; icon: React.ReactNode }[] = [
    { label: 'All', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { label: 'House', icon: <Home className="w-3.5 h-3.5" /> },
    { label: 'Apartment', icon: <Building className="w-3.5 h-3.5" /> },
    { label: 'Plot', icon: <Trees className="w-3.5 h-3.5" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#12141b]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-7"
    >
      
      {/* Top Row: Category Tabs & View Mode & List Property CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Category Pills: All, House, Apartment, Plot */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0c0d10]/90 border border-white/10 rounded-full backdrop-blur-md">
          {categories.map((cat) => {
            const isActive = filter.category === cat.label;
            const count = categoryCounts[cat.label] || 0;
            return (
              <motion.button
                key={cat.label}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFilterChange({ category: cat.label })}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] shadow-md shadow-[#c8a97e]/20 font-bold'
                    : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  isActive ? 'bg-[#0c0d10]/20 text-[#0c0d10]' : 'bg-white/10 text-stone-400'
                }`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Side: View Mode & Add Property Button */}
        <div className="flex items-center gap-3.5 self-start lg:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#0c0d10]/90 border border-white/10 rounded-full backdrop-blur-md">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange({ viewMode: 'grid' })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter.viewMode === 'grid'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange({ viewMode: 'map' })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter.viewMode === 'map'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Interactive Map View"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map View</span>
            </motion.button>
          </div>

          {/* Sell / List Property Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAddProperty}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-stone-200 bg-[#191c25] hover:bg-[#232733] border border-white/10 hover:border-[#c8a97e]/40 backdrop-blur-md transition-all shadow-md shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#dfc5a4]" />
            <span>+ Add Property</span>
          </motion.button>
        </div>
      </div>

      {/* Second Row: Detailed Search & Filter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 pt-4 border-t border-white/[0.08]">
        
        {/* Location & Keyword Search Input */}
        <div className="lg:col-span-4 relative">
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">
            Search Location or Title
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="e.g. Greenfield, California, Marina..."
              className="w-full pl-11 pr-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-2xl text-xs sm:text-sm text-stone-200 placeholder-stone-500 backdrop-blur-md focus:outline-none focus:border-[#c8a97e]/60 transition-colors"
            />
          </div>
        </div>

        {/* Price Range Selector */}
        <div className="lg:col-span-3">
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2 flex justify-between">
            <span>Max Price</span>
            <span className="text-[#dfc5a4] font-semibold">
              {filter.maxPrice >= 10000000 ? 'Any Price' : `$${(filter.maxPrice / 1000000).toFixed(1)}M`}
            </span>
          </label>
          <div className="relative flex items-center pt-2">
            <input
              type="range"
              min="500000"
              max="10000000"
              step="250000"
              value={filter.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-[#c8a97e] h-2 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Bedrooms Filter */}
        <div className="lg:col-span-2">
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">
            Bedrooms
          </label>
          <select
            value={filter.bedrooms}
            onChange={(e) =>
              onFilterChange({
                bedrooms: e.target.value === 'all' ? 'all' : Number(e.target.value),
              })
            }
            className="w-full px-3.5 py-3 bg-[#0c0d10]/80 border border-white/10 rounded-2xl text-xs sm:text-sm text-stone-200 backdrop-blur-md focus:outline-none focus:border-[#c8a97e]/60 transition-colors cursor-pointer"
          >
            <option value="all">Any Beds</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
            <option value="5">5+ Bedrooms</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="lg:col-span-2">
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">
            Sort By
          </label>
          <select
            value={filter.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="w-full px-3.5 py-3 bg-[#0c0d10]/80 border border-white/10 rounded-2xl text-xs sm:text-sm text-stone-200 backdrop-blur-md focus:outline-none focus:border-[#c8a97e]/60 transition-colors cursor-pointer"
          >
            <option value="featured">Curated First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Listed</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="lg:col-span-1 flex items-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetFilter}
            className="w-full py-3 bg-[#191c25] hover:bg-[#232733] border border-white/10 hover:border-white/20 rounded-2xl text-xs text-stone-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="lg:hidden">Reset</span>
          </motion.button>
        </div>

      </div>

    </motion.div>
  );
};
