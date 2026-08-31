import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Video, 
  UserCheck, 
  Sparkles, 
  Building, 
  ArrowRight,
  ArrowLeft,
  Phone, 
  Mail, 
  User 
} from 'lucide-react';
import { Property, TourType, UserProfile } from '../types';
import { createViewingBooking } from '../lib/firebase';

interface BookViewingModalProps {
  property: Property | null;
  currentUser: UserProfile | null;
  allProperties?: Property[];
  onClose: () => void;
  onBookingSuccess: () => void;
  onOpenAuth: () => void;
}

export const BookViewingModal: React.FC<BookViewingModalProps> = ({
  property,
  currentUser,
  allProperties = [],
  onClose,
  onBookingSuccess,
  onOpenAuth,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(property || allProperties[0] || null);

  // Next 10 days generator
  const availableDates = Array.from({ length: 10 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      dateString: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.dateString || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [tourType, setTourType] = useState<TourType>('In-Person Walkthrough');
  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('+1 (555) 349-8821');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
    '06:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    setIsSubmitting(true);
    try {
      const bookingId = await createViewingBooking({
        propertyId: selectedProperty.id,
        propertyTitle: selectedProperty.title,
        propertyLocation: selectedProperty.address || selectedProperty.location,
        propertyImage: selectedProperty.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        propertyPrice: selectedProperty.price,
        category: selectedProperty.category,
        userId: currentUser?.uid || 'guest-visitor',
        userName: name || 'Valued Client',
        userEmail: email || 'client@example.com',
        userPhone: phone,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        tourType: tourType,
        notes: notes.trim() || undefined,
        status: 'confirmed',
      });

      // Fire celebratory champagne confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#dfc5a4', '#ffffff', '#c8a97e', '#8c734b']
      });

      setConfirmedBookingId(bookingId);
      onBookingSuccess();
    } catch (err) {
      console.error('Failed to create booking:', err);
      alert('Unable to schedule visit right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#08090b]/85 backdrop-blur-2xl flex items-start sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full min-h-[100svh] sm:min-h-0 sm:max-h-[92vh] sm:max-w-2xl bg-[#12141b]/95 backdrop-blur-2xl border-0 sm:border border-[#c8a97e]/30 rounded-none sm:rounded-[32px] overflow-y-auto shadow-2xl shadow-black/90 sm:my-6 pb-[env(safe-area-inset-bottom)]">
        
        {/* Header */}
        <div className="sticky top-0 z-30 px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between bg-[#0c0d10]/95 backdrop-blur-xl pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button onClick={onClose} className="sm:hidden min-h-11 min-w-11 -ml-2 rounded-full text-stone-200 hover:bg-white/10 flex items-center justify-center" aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-[#1a1d26] border border-[#c8a97e]/30 flex items-center justify-center text-[#dfc5a4] shadow-md">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-base sm:text-lg font-bold text-white truncate">Book a Private Viewing</h3>
              <p className="hidden min-[380px]:block text-[11px] text-stone-400 font-light truncate">Schedule an exclusive walkthrough with a Homevia specialist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hidden sm:flex p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmedBookingId ? (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white">Visit Confirmed!</h4>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto font-light leading-relaxed">
                Your private viewing for <strong className="text-white font-medium">{selectedProperty?.title}</strong> has been secured and registered.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-6 bg-[#0c0d10]/60 backdrop-blur-md rounded-2xl border border-[#c8a97e]/20 text-left max-w-md mx-auto space-y-3.5 text-xs">
              <div className="flex justify-between pb-2.5 border-b border-white/10">
                <span className="text-stone-400">Reference Code</span>
                <span className="font-mono text-[#dfc5a4] font-bold">#HMV-{confirmedBookingId.slice(0, 7).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Date & Time</span>
                <span className="text-white font-medium">{selectedDate} at {selectedTimeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Tour Format</span>
                <span className="text-white font-medium">{tourType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Visitor Name</span>
                <span className="text-white font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Location</span>
                <span className="text-white font-medium truncate max-w-[200px]">{selectedProperty?.address || selectedProperty?.location}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full text-xs font-bold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] hover:brightness-110 shadow-lg shadow-[#c8a97e]/20 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Main Booking Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-5 sm:space-y-6">
            
            {/* Property Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider">
                Select Property for Viewing
              </label>
              {selectedProperty ? (
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 sm:p-3.5 bg-[#0c0d10]/60 backdrop-blur-md border border-white/10 rounded-2xl">
                  <img
                    src={selectedProperty.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                    alt={selectedProperty.title}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white text-sm truncate">{selectedProperty.title}</h5>
                    <p className="text-xs text-stone-400 truncate font-light">{selectedProperty.address || selectedProperty.location}</p>
                    <p className="text-xs text-[#dfc5a4] font-semibold mt-0.5">${selectedProperty.price.toLocaleString()}</p>
                  </div>
                  {allProperties.length > 1 && (
                    <select
                      value={selectedProperty.id}
                      onChange={(e) => {
                        const found = allProperties.find(p => p.id === e.target.value);
                        if (found) setSelectedProperty(found);
                      }}
                      className="w-full sm:w-auto min-h-11 text-xs bg-[#171920] border border-white/15 text-stone-200 p-2.5 rounded-xl focus:outline-none focus:border-[#c8a97e]"
                    >
                      {allProperties.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <p className="text-xs text-rose-400">Please select a property first</p>
              )}
            </div>

            {/* Tour Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider">
                Tour Experience
              </label>
              <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTourType('In-Person Walkthrough')}
                  className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                    tourType === 'In-Person Walkthrough'
                      ? 'bg-[#c8a97e]/20 border-[#c8a97e] text-white shadow-md'
                      : 'bg-[#0c0d10]/40 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#dfc5a4]" />
                  <span>In-Person Walkthrough</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTourType('Live Video Tour')}
                  className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                    tourType === 'Live Video Tour'
                      ? 'bg-[#c8a97e]/20 border-[#c8a97e] text-white shadow-md'
                      : 'bg-[#0c0d10]/40 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#dfc5a4]" />
                  <span>Live 4K Video Tour</span>
                </button>
              </div>
            </div>

            {/* Date Picker Horizontal Strip */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider">
                Select Preferred Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.dateString;
                  return (
                    <button
                      key={item.dateString}
                      type="button"
                      onClick={() => setSelectedDate(item.dateString)}
                      className={`flex flex-col items-center justify-center min-w-[66px] py-2.5 px-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] font-bold border-[#c8a97e] shadow-md shadow-[#c8a97e]/20'
                          : 'bg-[#0c0d10]/40 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider">{item.dayName}</span>
                      <span className="text-base font-bold my-0.5">{item.dayNumber}</span>
                      <span className="text-[10px] opacity-80">{item.monthName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider">
                Select Time Slot
              </label>
              <div className="grid grid-cols-2 min-[380px]:grid-cols-3 sm:grid-cols-6 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-2 text-center rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#c8a97e] text-[#0c0d10] font-bold border-[#dfc5a4] shadow-md'
                          : 'bg-[#0c0d10]/40 border-white/10 text-stone-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Vance"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-stone-400 mb-1">Phone Number (SMS Confirmation)</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-stone-400 mb-1">Special Requirements or Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Interested in private garden zoning and financing options..."
                  rows={2}
                  className="w-full p-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="flex flex-col-reverse min-[380px]:flex-row items-stretch min-[380px]:items-center justify-end gap-2.5 sm:gap-3.5 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 px-5 py-2.5 rounded-full text-xs font-semibold text-stone-400 hover:text-white bg-transparent cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedProperty}
                className="min-h-12 px-5 sm:px-7 py-3 rounded-full text-xs font-bold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c8a97e]/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Securing Date...</span>
                ) : (
                  <>
                    <span>Confirm & Schedule Viewing</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0c0d10]" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
