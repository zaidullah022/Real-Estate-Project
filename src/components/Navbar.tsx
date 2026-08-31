import React, { useState } from 'react';
import { 
  Building2, 
  CalendarCheck, 
  PlusCircle, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  Home, 
  ArrowUpRight, 
  ShieldCheck, 
  Heart 
} from 'lucide-react';
import { UserProfile, Booking, Property } from '../types';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAddProperty: () => void;
  onOpenBookings: () => void;
  onOpenQuickVisit: () => void;
  userBookingsCount: number;
  userPropertiesCount: number;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAddProperty,
  onOpenBookings,
  onOpenQuickVisit,
  userBookingsCount,
  userPropertiesCount,
  savedCount = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c0d10]/80 backdrop-blur-2xl border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Homevia with Architectural Monogram */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#171920] border border-[#c8a97e]/30 flex items-center justify-center backdrop-blur-md shadow-lg shadow-black/40 transition-transform group-hover:scale-105">
              <svg 
                className="w-5 h-5 text-[#dfc5a4]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 21V9l8-6 8 6v12" />
                <path d="M9 21v-7h6v7" />
              </svg>
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-[#dfc5a4] transition-colors">
              Homevia
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-9 text-sm font-medium text-stone-300">
            <a href="#home" className="hover:text-white transition-colors duration-200">
              Home
            </a>
            <a href="#about" className="hover:text-white transition-colors duration-200">
              About
            </a>
            <a href="#properties" className="hover:text-white transition-colors duration-200">
              Properties
            </a>
            <a href="#about" className="hover:text-white transition-colors duration-200">
              Blog
            </a>
            <a href="#consultation" className="hover:text-white transition-colors duration-200">
              Contact
            </a>
          </div>

          {/* Right Action Controls: "Book a Visit ↗" & User Hub */}
          <div className="hidden md:flex items-center gap-3.5">
            
            {/* Quick Listing Creator */}
            <button
              onClick={onOpenAddProperty}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-stone-200 bg-[#16181f] hover:bg-[#1f222b] border border-white/10 hover:border-[#c8a97e]/40 transition-all cursor-pointer shadow-sm"
              title="List your property"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#dfc5a4]" />
              <span>+ Add Listing</span>
            </button>

            {/* Book a Visit Pill Button - Frosted with Champagne Highlights */}
            <button
              onClick={onOpenQuickVisit}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] via-[#c8a97e] to-[#b8956e] hover:brightness-110 transition-all shadow-md shadow-[#c8a97e]/15 group cursor-pointer"
            >
              <span>Book a Visit</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#0c0d10] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Auth / Profile Hub */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full bg-[#171920] hover:bg-[#20232c] border border-white/10 hover:border-[#c8a97e]/30 backdrop-blur-md transition-all text-left cursor-pointer shadow-md"
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName} 
                      className="w-7 h-7 rounded-full object-cover border border-[#c8a97e]/60"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#2a2d38] text-[#dfc5a4] font-bold text-xs flex items-center justify-center border border-[#c8a97e]/40">
                      {currentUser.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-medium text-stone-200 max-w-[90px] truncate">
                    {currentUser.displayName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-[#12141a]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 shadow-2xl shadow-black/90 z-50 text-xs space-y-1">
                    <div className="px-3 py-2.5 border-b border-white/10">
                      <p className="font-semibold text-white truncate">{currentUser.displayName}</p>
                      <p className="text-[11px] text-stone-400 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenBookings();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/[0.06] flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <User className="w-3.5 h-3.5 text-[#dfc5a4]" />
                        My Dashboard & Profile
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenBookings();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/[0.06] flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <CalendarCheck className="w-3.5 h-3.5 text-[#dfc5a4]" />
                        Viewing Bookings
                      </span>
                      {userBookingsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#c8a97e]/20 text-[#dfc5a4] text-[10px] font-bold">
                          {userBookingsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenBookings();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/[0.06] flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        Saved Favorites
                      </span>
                      {savedCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                          {savedCount}
                        </span>
                      )}
                    </button>

                    <div className="pt-1.5 border-t border-white/10">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-rose-300 hover:bg-rose-500/15 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-full text-xs font-medium text-stone-200 hover:text-white bg-[#171920] hover:bg-[#20232c] border border-white/10 hover:border-[#c8a97e]/30 transition-all cursor-pointer shadow-sm"
              >
                Sign In
              </button>
            )}

          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenQuickVisit}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] flex items-center gap-1 shadow-sm"
            >
              <span>Visit</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-[#171920] text-stone-200 hover:text-white border border-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0c0d10]/95 backdrop-blur-2xl border-b border-white/10 px-5 pt-4 pb-7 space-y-4">
          <div className="flex flex-col space-y-2 text-sm text-stone-300">
            <a 
              href="#home" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/[0.06]"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/[0.06]"
            >
              About
            </a>
            <a 
              href="#properties" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/[0.06]"
            >
              Properties
            </a>
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/[0.06]"
            >
              Blog
            </a>
            <a 
              href="#consultation" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/[0.06]"
            >
              Contact
            </a>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAddProperty();
              }}
              className="w-full py-3 rounded-2xl bg-[#171920] border border-[#c8a97e]/30 text-xs font-semibold text-white flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#dfc5a4]" />
              <span>+ Add Property Listing</span>
            </button>

            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenBookings();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium text-white flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-[#dfc5a4]" />
                  <span>My Dashboard & Bookings ({userBookingsCount})</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 rounded-xl bg-rose-500/10 text-rose-300 text-xs font-medium flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-3 rounded-2xl bg-[#171920] border border-white/10 text-xs font-semibold text-stone-200"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
