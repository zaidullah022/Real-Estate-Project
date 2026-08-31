import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  KeyRound, 
  Clock, 
  Send, 
  CheckCircle, 
  Building2, 
  Users, 
  Award,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface AboutAndConsultationProps {
  onOpenQuickVisit: () => void;
}

export const AboutAndConsultation: React.FC<AboutAndConsultationProps> = ({
  onOpenQuickVisit,
}) => {
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultCategory, setConsultCategory] = useState('House');
  const [consultBudget, setConsultBudget] = useState('$2M - $5M');
  const [isSent, setIsSent] = useState(false);

  const pillars = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#dfc5a4]" />,
      title: 'Architectural Curation',
      desc: 'Every modern house, skyline apartment, and zoned plot is vetted for design integrity, construction pedigree, and long-term value.'
    },
    {
      icon: <KeyRound className="w-5 h-5 text-[#dfc5a4]" />,
      title: 'Seamless Private Viewings',
      desc: 'Book instant in-person private walkthroughs or live 4K interactive video tours with direct agent accompaniment on your schedule.'
    },
    {
      icon: <Building2 className="w-5 h-5 text-[#dfc5a4]" />,
      title: 'Direct Seller Publishing',
      desc: 'Property owners and developers can list luxury residences with full autonomous controls to update pricing, specifications, and images in real time.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#dfc5a4]" />,
      title: 'Durable Cloud Persistence',
      desc: 'Integrated with Firebase Firestore and Auth to safeguard user bookings, profile credentials, and property listings securely across devices.'
    }
  ];

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setConsultName('');
      setConsultEmail('');
    }, 4000);
  };

  return (
    <div className="space-y-24 py-16">
      
      {/* SECTION: About Homevia & Pillars */}
      <section id="about" className="space-y-14">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfc5a4] font-semibold">
            The Homevia Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Elevating Real Estate Discovery
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            Homevia redefines how clients discover, tour, and acquire modern architecture. We combine minimalist aesthetics with powerful technology.
          </p>
        </motion.div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-[#12141b]/80 backdrop-blur-xl border border-[#c8a97e]/20 rounded-[28px] p-6 space-y-4 hover:border-[#c8a97e]/50 transition-all duration-300 group shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#171922] border border-[#c8a97e]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                {p.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#dfc5a4] transition-colors">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Row with AnimatedCounter */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="bg-[#12141b]/80 backdrop-blur-xl border border-[#c8a97e]/20 rounded-[32px] p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-xl"
        >
          <div className="space-y-1 border-r border-white/5">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-white">
              <AnimatedCounter target={1.2} duration={1.8} decimals={1} suffix="M+" />
            </p>
            <p className="text-xs text-stone-400 uppercase tracking-wider font-light">Trusted Clients</p>
          </div>
          <div className="space-y-1 lg:border-r border-white/5">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-[#dfc5a4]">
              <AnimatedCounter target={2.4} duration={1.8} decimals={1} prefix="$" suffix="B+" />
            </p>
            <p className="text-xs text-stone-400 uppercase tracking-wider font-light">Properties Handled</p>
          </div>
          <div className="space-y-1 border-r border-white/5">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-white">
              <AnimatedCounter target={99.4} duration={1.8} decimals={1} suffix="%" />
            </p>
            <p className="text-xs text-stone-400 uppercase tracking-wider font-light">Satisfaction Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-[#dfc5a4]">24/7</p>
            <p className="text-xs text-stone-400 uppercase tracking-wider font-light">Concierge Advisory</p>
          </div>
        </motion.div>
      </section>

      {/* SECTION: Consultation / Contact Concierge */}
      <motion.section 
        id="consultation"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65 }}
        className="relative rounded-[36px] overflow-hidden border border-[#c8a97e]/30 bg-[#12141b]/90 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#dfc5a4] font-semibold">
                Private Advisory
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Request a Confidential Consultation
              </h2>
              <p className="text-sm text-stone-400 font-light leading-relaxed">
                Whether you are seeking an architectural landmark, looking to list an off-market estate, or planning a plot development, our private advisory team is here for you.
              </p>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1c1f2a] border border-[#c8a97e]/30 flex items-center justify-center text-[#dfc5a4]">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-light">Direct VIP Line: +1 (800) 466-3842</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1c1f2a] border border-[#c8a97e]/30 flex items-center justify-center text-[#dfc5a4]">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-light">concierge@homevia.luxury</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#0c0d10]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            {isSent ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">Inquiry Received</h3>
                <p className="text-xs text-stone-300">A Senior Homevia Advisor will contact you within 2 business hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1 font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="e.g. Sterling Hayes"
                    className="w-full px-4 py-3 bg-[#12141b]/90 border border-white/10 rounded-xl text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-[#c8a97e]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={consultEmail}
                    onChange={(e) => setConsultEmail(e.target.value)}
                    placeholder="sterling@example.com"
                    className="w-full px-4 py-3 bg-[#12141b]/90 border border-white/10 rounded-xl text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-[#c8a97e]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1 font-medium">Interest</label>
                    <select
                      value={consultCategory}
                      onChange={(e) => setConsultCategory(e.target.value)}
                      className="w-full px-3 py-3 bg-[#12141b] border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-[#c8a97e] cursor-pointer"
                    >
                      <option value="House">Luxury Houses</option>
                      <option value="Apartment">Sky Penthouses</option>
                      <option value="Plot">Development Plots</option>
                      <option value="Seller">List My Property</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1 font-medium">Budget Range</label>
                    <select
                      value={consultBudget}
                      onChange={(e) => setConsultBudget(e.target.value)}
                      className="w-full px-3 py-3 bg-[#12141b] border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-[#c8a97e] cursor-pointer"
                    >
                      <option value="$1M - $2M">$1M - $2M</option>
                      <option value="$2M - $5M">$2M - $5M</option>
                      <option value="$5M - $10M">$5M - $10M</option>
                      <option value="$10M+">$10M+</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, brightness: 1.1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 rounded-full text-xs font-bold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] shadow-lg shadow-[#c8a97e]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#0c0d10]" />
                  <span>Send Advisory Request</span>
                </motion.button>
              </form>
            )}
          </div>

        </div>
      </motion.section>

    </div>
  );
};
