import React from 'react';
import { ArrowUp, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#c8a97e]/20 bg-[#08090b]/95 backdrop-blur-xl pt-16 pb-12 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#12141b] border border-[#c8a97e]/40 flex items-center justify-center backdrop-blur-md shadow-sm">
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
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Homevia
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed font-light">
              Connecting discerning clients with modern architectural estates, sky residences, and generational development land worldwide.
            </p>
            <div className="flex items-center gap-2 text-stone-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#dfc5a4]" />
              <span className="font-light">Licensed & Certified Luxury Real Estate Advisory</span>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wide">Property Portfolio</h4>
            <ul className="space-y-2 font-light">
              <li><a href="#properties" className="hover:text-[#dfc5a4] transition-colors">Architectural Houses</a></li>
              <li><a href="#properties" className="hover:text-[#dfc5a4] transition-colors">Skyline Apartments</a></li>
              <li><a href="#properties" className="hover:text-[#dfc5a4] transition-colors">Development Plots</a></li>
              <li><a href="#featured" className="hover:text-[#dfc5a4] transition-colors">Featured Residences</a></li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wide">Experience</h4>
            <ul className="space-y-2 font-light">
              <li><a href="#home" className="hover:text-[#dfc5a4] transition-colors">Virtual Walkthroughs</a></li>
              <li><a href="#about" className="hover:text-[#dfc5a4] transition-colors">Private Viewings</a></li>
              <li><a href="#consultation" className="hover:text-[#dfc5a4] transition-colors">Advisory Consultation</a></li>
              <li><a href="#home" className="hover:text-[#dfc5a4] transition-colors">Seller Publishing Hub</a></li>
            </ul>
          </div>

          {/* Col 5: Global Offices */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wide">Offices</h4>
            <div className="space-y-2 text-xs font-light">
              <p className="text-white font-medium">San Francisco • Beverly Hills • New York</p>
              <p>1200 Avenue of the Americas, Floor 34</p>
              <p className="text-[#dfc5a4]">concierge@homevia.luxury</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-light">
          <p>© {new Date().getFullYear()} Homevia Real Estate Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#dfc5a4] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#dfc5a4] cursor-pointer">Terms of Service</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-[#12141b] hover:bg-[#1a1d26] text-[#dfc5a4] border border-[#c8a97e]/30 backdrop-blur-md transition-colors cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
