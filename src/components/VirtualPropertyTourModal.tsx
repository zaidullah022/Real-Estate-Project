import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  MapPin, 
  Compass, 
  Eye, 
  EyeOff, 
  Sparkles, 
  DoorOpen, 
  Utensils, 
  Bed, 
  Bath as BathIcon, 
  Sun, 
  Package, 
  Trees, 
  Layers, 
  Calendar, 
  ArrowRight,
  Info,
  Footprints
} from 'lucide-react';
import { Property, TourRoom, TourHotspot } from '../types';
import { generatePropertyTour } from '../utils/tourGenerator';
import { tourSound } from '../utils/tourSound';

interface VirtualPropertyTourModalProps {
  property: Property;
  onClose: () => void;
  onBookViewing?: (property: Property) => void;
}

export const VirtualPropertyTourModal: React.FC<VirtualPropertyTourModalProps> = ({
  property,
  onClose,
  onBookViewing,
}) => {
  // Generate the tour rooms dynamically
  const tourRooms: TourRoom[] = useMemo(() => {
    return generatePropertyTour(property);
  }, [property]);

  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [isEntering, setIsEntering] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [isAutoTourActive, setIsAutoTourActive] = useState(false);
  const [autoTourProgress, setAutoTourProgress] = useState(0);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<TourHotspot | null>(null);
  const [showControls, setShowControls] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const autoTourIntervalRef = useRef<number | null>(null);

  const currentRoom = tourRooms[currentRoomIndex] || tourRooms[0];
  const isExterior = currentRoomIndex === 0;

  // Handle audio mute toggle
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    tourSound.setMuted(nextMute);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Auto-fade controls when user is inactive
  const resetInactivityTimer = useCallback(() => {
    setShowControls(true);
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = window.setTimeout(() => {
      // Keep controls visible if hovering interactive menus or on exterior landing
      if (!isExterior) {
        setShowControls(false);
      }
    }, 4000);
  }, [isExterior]);

  useEffect(() => {
    const handleMouseMove = () => resetInactivityTimer();
    const handleTouchStart = () => resetInactivityTimer();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  // Navigate to specific room index with direction
  const goToRoom = (index: number, direction: 'forward' | 'backward' = 'forward') => {
    if (index === currentRoomIndex || index < 0 || index >= tourRooms.length) return;
    setTransitionDirection(direction);
    tourSound.playTransitionSwoosh();
    setCurrentRoomIndex(index);
    setAutoTourProgress(0);
  };

  // Handle Hotspot Navigation
  const handleHotspotClick = (targetRoomId: string) => {
    tourSound.playHotspotClick();
    const targetIdx = tourRooms.findIndex((r) => r.id === targetRoomId);
    if (targetIdx !== -1) {
      goToRoom(targetIdx, targetIdx > currentRoomIndex ? 'forward' : 'backward');
    }
  };

  // Handle Enter Property animation
  const handleEnterProperty = () => {
    setIsEntering(true);
    tourSound.playEnterChime();

    // Smooth forward push animation before moving to entrance room (index 1)
    setTimeout(() => {
      setIsEntering(false);
      if (tourRooms.length > 1) {
        goToRoom(1, 'forward');
      }
    }, 700);
  };

  // Next / Prev navigation
  const handleNextRoom = () => {
    const nextIdx = (currentRoomIndex + 1) % tourRooms.length;
    goToRoom(nextIdx, 'forward');
  };

  const handlePrevRoom = () => {
    const prevIdx = (currentRoomIndex - 1 + tourRooms.length) % tourRooms.length;
    goToRoom(prevIdx, 'backward');
  };

  // Auto Guided Tour Loop
  useEffect(() => {
    if (!isAutoTourActive) {
      setAutoTourProgress(0);
      if (autoTourIntervalRef.current) {
        window.clearInterval(autoTourIntervalRef.current);
      }
      return;
    }

    const duration = 6000; // 6 seconds per room
    const step = 50; // update progress every 50ms
    let elapsed = 0;

    autoTourIntervalRef.current = window.setInterval(() => {
      elapsed += step;
      const progressPercent = Math.min(100, (elapsed / duration) * 100);
      setAutoTourProgress(progressPercent);

      if (elapsed >= duration) {
        elapsed = 0;
        setAutoTourProgress(0);
        setCurrentRoomIndex((prev) => {
          const next = (prev + 1) % tourRooms.length;
          tourSound.playTransitionSwoosh();
          return next;
        });
      }
    }, step);

    return () => {
      if (autoTourIntervalRef.current) {
        window.clearInterval(autoTourIntervalRef.current);
      }
    };
  }, [isAutoTourActive, tourRooms.length]);

  // Keyboard navigation support (Escape to close, Arrows to navigate, Space to toggle auto-tour)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNextRoom();
      } else if (e.key === 'ArrowLeft') {
        handlePrevRoom();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoTourActive((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'h' || e.key === 'H') {
        setShowHotspots((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRoomIndex, tourRooms.length]);

  // Get icon for hotspot
  const getHotspotIcon = (iconName?: string) => {
    switch (iconName) {
      case 'kitchen':
        return <Utensils className="w-4 h-4 text-[#dfc5a4]" />;
      case 'bed':
        return <Bed className="w-4 h-4 text-[#dfc5a4]" />;
      case 'bath':
        return <BathIcon className="w-4 h-4 text-[#dfc5a4]" />;
      case 'balcony':
        return <Sun className="w-4 h-4 text-[#dfc5a4]" />;
      case 'box':
        return <Package className="w-4 h-4 text-[#dfc5a4]" />;
      case 'garden':
        return <Trees className="w-4 h-4 text-[#dfc5a4]" />;
      case 'compass':
        return <Compass className="w-4 h-4 text-[#dfc5a4]" />;
      case 'door':
      default:
        return <DoorOpen className="w-4 h-4 text-[#dfc5a4]" />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black select-none overflow-hidden flex flex-col items-center justify-between"
      style={{ touchAction: 'none' }}
    >
      
      {/* 3D Walkthrough Viewport & Image Canvas */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0a0b0e]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentRoom.id}
            initial={{
              scale: isEntering ? 1.4 : transitionDirection === 'forward' ? 1.16 : 0.92,
              opacity: 0,
              filter: 'blur(10px)'
            }}
            animate={{
              scale: isEntering ? 1.35 : 1.0,
              opacity: 1,
              filter: 'blur(0px)'
            }}
            exit={{
              scale: transitionDirection === 'forward' ? 0.94 : 1.14,
              opacity: 0,
              filter: 'blur(8px)'
            }}
            transition={{
              duration: isEntering ? 0.8 : 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Room Background Image with Subtle Slow Movement */}
            <img
              src={currentRoom.image}
              alt={currentRoom.name}
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{
                transform: 'scale(1.03)',
                transformOrigin: 'center center',
              }}
            />

            {/* Depth & Vignette Gradients for Photoreal Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Interactive Hotspots Layer */}
        {showHotspots && !isEntering && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <AnimatePresence>
              {currentRoom.hotspots.map((hotspot) => {
                const isHovered = hoveredHotspot?.id === hotspot.id;
                return (
                  <motion.div
                    key={hotspot.id}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{
                      left: `${hotspot.position.x}%`,
                      top: `${hotspot.position.y}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    onMouseEnter={() => setHoveredHotspot(hotspot)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                  >
                    {/* Pulsing Hotspot Target Node */}
                    <div className="relative group cursor-pointer">
                      
                      {/* Outer Radar Ripple Effect */}
                      <span className="absolute -inset-3 rounded-full bg-[#c8a97e]/25 animate-ping opacity-75 group-hover:bg-[#dfc5a4]/40" />
                      <span className="absolute -inset-1.5 rounded-full bg-[#c8a97e]/40 animate-pulse" />

                      {/* Core Glowing Button */}
                      <button
                        onClick={() => handleHotspotClick(hotspot.targetRoomId)}
                        aria-label={`Navigate to ${hotspot.roomName}`}
                        className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0c0d10]/85 border-2 border-[#dfc5a4] shadow-xl shadow-black/80 flex items-center justify-center backdrop-blur-xl group-hover:scale-115 group-hover:border-white transition-all duration-300 cursor-pointer"
                      >
                        {getHotspotIcon(hotspot.icon)}
                      </button>

                      {/* Floating Destination Tooltip Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ 
                          opacity: isHovered ? 1 : 0.92, 
                          y: 0, 
                          scale: isHovered ? 1.05 : 1 
                        }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleHotspotClick(hotspot.targetRoomId)}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 whitespace-nowrap bg-[#0c0d10]/95 backdrop-blur-2xl border border-[#c8a97e]/40 py-2 px-3.5 rounded-2xl shadow-2xl shadow-black flex items-center gap-2.5 text-xs text-white group-hover:border-[#dfc5a4] transition-all cursor-pointer z-30"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#dfc5a4] animate-pulse" />
                        <div className="text-left">
                          <p className="font-semibold text-[13px] text-[#dfc5a4] leading-tight flex items-center gap-1.5">
                            {hotspot.label}
                            <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:translate-x-1 transition-transform" />
                          </p>
                          {hotspot.description && (
                            <p className="text-[11px] text-stone-400 font-light max-w-[200px] truncate">
                              {hotspot.description}
                            </p>
                          )}
                        </div>
                      </motion.div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Big Animated "Enter Property" Entrance Portal on Exterior View */}
        {isExterior && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
          >
            <div className="max-w-xl space-y-5 bg-[#0c0d10]/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[36px] border border-[#c8a97e]/40 shadow-2xl shadow-black pointer-events-auto">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c1f28]/90 border border-[#c8a97e]/40 text-[#dfc5a4] text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive 3D Walkthrough</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  {property.title}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 font-light flex items-center justify-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#c8a97e]" />
                  <span>{property.address || property.location}</span>
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
                Begin your private architectural walkthrough. Step through the entrance, explore room-by-room with 360° hotspots, or start an automated guided tour.
              </p>

              {/* Enter Button with Pulsing Radar Ring */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05, brightness: 1.1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleEnterProperty}
                  disabled={isEntering}
                  className="relative px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] via-[#e5d1b8] to-[#c8a97e] shadow-2xl shadow-[#c8a97e]/40 transition-all flex items-center justify-center gap-3 cursor-pointer group w-full sm:w-auto"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0c0d10] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0c0d10]" />
                  </span>
                  <Footprints className="w-4 h-4 text-[#0c0d10] group-hover:translate-x-1 transition-transform" />
                  <span>{isEntering ? 'Entering Property...' : 'Enter Property & Begin Tour'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    handleEnterProperty();
                    setTimeout(() => setIsAutoTourActive(true), 900);
                  }}
                  className="px-6 py-4 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-xl transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  <Play className="w-3.5 h-3.5 text-[#dfc5a4]" />
                  <span>Start Auto Tour</span>
                </motion.button>
              </div>

            </div>
          </motion.div>
        )}

      </div>

      {/* TOP HEADER HUD (Auto-Fades on Inactivity) */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-30 w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/80 via-black/40 to-transparent"
          >
            {/* Left: Property Branding & Active Room Badge */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:block">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#dfc5a4]">
                  Homevia Virtual Walkthrough
                </span>
                <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate max-w-xs sm:max-w-md">
                  {property.title}
                </h2>
              </div>

              {/* Room Location Chip */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c0d10]/80 border border-[#c8a97e]/40 backdrop-blur-xl text-xs text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-[#dfc5a4]">{currentRoom.name}</span>
                <span className="text-stone-500 font-light">|</span>
                <span className="text-stone-300 text-[11px]">
                  {currentRoomIndex + 1} of {tourRooms.length}
                </span>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Floor Plan / Rooms Map Toggle */}
              <button
                onClick={() => setShowFloorPlan((prev) => !prev)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all backdrop-blur-xl border cursor-pointer ${
                  showFloorPlan
                    ? 'bg-[#c8a97e] text-[#0c0d10] border-[#c8a97e]'
                    : 'bg-[#0c0d10]/80 text-stone-200 hover:text-white border-white/15 hover:border-white/30'
                }`}
                title="Toggle Floor Plan & Room Navigator (M)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rooms & Map</span>
              </button>

              {/* Book Viewing Direct CTA */}
              {onBookViewing && (
                <button
                  onClick={() => {
                    onClose();
                    onBookViewing(property);
                  }}
                  className="hidden md:flex px-4 py-2 rounded-full text-xs font-bold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] hover:brightness-110 shadow-lg shadow-[#c8a97e]/20 items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Private Visit</span>
                </button>
              )}

              {/* Audio Sound Toggle */}
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-full bg-[#0c0d10]/80 hover:bg-[#1a1d26] text-stone-300 hover:text-white border border-white/15 backdrop-blur-xl transition-all cursor-pointer"
                title={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#dfc5a4]" />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2.5 rounded-full bg-[#0c0d10]/80 hover:bg-[#1a1d26] text-stone-300 hover:text-white border border-white/15 backdrop-blur-xl transition-all cursor-pointer"
                title="Toggle Fullscreen (F)"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Tour */}
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 backdrop-blur-xl transition-all cursor-pointer"
                title="Exit Walkthrough (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOOR PLAN & INTERACTIVE ROOM SELECTOR DRAWER */}
      <AnimatePresence>
        {showFloorPlan && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-4 sm:left-8 top-20 sm:top-24 bottom-28 z-40 w-72 sm:w-80 bg-[#0c0d10]/95 backdrop-blur-2xl border border-[#c8a97e]/30 rounded-3xl p-5 flex flex-col shadow-2xl shadow-black/90 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#dfc5a4]" />
                <span className="text-xs uppercase font-bold tracking-wider text-white">
                  Property Floor Map
                </span>
              </div>
              <button
                onClick={() => setShowFloorPlan(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-stone-400 py-2.5 font-light">
              Select any room to instantly walk into that area:
            </p>

            {/* Room List Scrollable Area */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {tourRooms.map((room, idx) => {
                const isActive = idx === currentRoomIndex;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      goToRoom(idx, idx > currentRoomIndex ? 'forward' : 'backward');
                      if (window.innerWidth < 640) {
                        setShowFloorPlan(false);
                      }
                    }}
                    className={`w-full p-2.5 rounded-2xl border transition-all text-left flex items-center gap-3 cursor-pointer group ${
                      isActive
                        ? 'bg-[#1e222c] border-[#dfc5a4] shadow-lg shadow-black'
                        : 'bg-[#12141a]/60 hover:bg-[#181b22] border-white/10 hover:border-[#c8a97e]/40'
                    }`}
                  >
                    {/* Thumbnail preview */}
                    <div className="relative w-12 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                      {isActive && (
                        <div className="absolute inset-0 bg-[#c8a97e]/30 border border-[#dfc5a4]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-semibold truncate ${isActive ? 'text-[#dfc5a4]' : 'text-white group-hover:text-[#dfc5a4]'}`}>
                          {room.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-stone-400 truncate font-light">
                        {room.floorLevel || room.category}
                      </p>
                    </div>

                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Summary at bottom */}
            <div className="pt-3 border-t border-white/10 text-center">
              <span className="text-[11px] text-stone-400">
                {tourRooms.length} Curated Tour Locations
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENTER OVERLAY: Current Room Title & Description Banner */}
      {!isExterior && (
        <div className="absolute bottom-28 sm:bottom-28 left-4 sm:left-8 right-4 sm:right-auto z-20 pointer-events-none max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoom.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="bg-[#0c0d10]/85 backdrop-blur-2xl border border-[#c8a97e]/30 p-4 sm:p-5 rounded-3xl shadow-2xl shadow-black pointer-events-auto space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#dfc5a4]">
                  {currentRoom.category}
                </span>
                {isAutoTourActive && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Auto Guided Tour
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                {currentRoom.name}
              </h3>

              {currentRoom.description && (
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {currentRoom.description}
                </p>
              )}

              {/* Progress bar if Auto Guided Tour is active */}
              {isAutoTourActive && (
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e]"
                    style={{ width: `${autoTourProgress}%` }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* BOTTOM FLOATING CONTROLS DOCK (Auto-fading on Inactivity) */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative z-30 w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-center pointer-events-auto bg-gradient-to-t from-black/90 via-black/40 to-transparent"
          >
            <div className="bg-[#0c0d10]/90 backdrop-blur-2xl border border-[#c8a97e]/40 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xl shadow-black flex items-center gap-2 sm:gap-4">
              
              {/* Previous Room Button */}
              <button
                onClick={handlePrevRoom}
                className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                title="Previous Room (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Auto Guided Tour Play / Pause */}
              <button
                onClick={() => setIsAutoTourActive((prev) => !prev)}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  isAutoTourActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/10'
                }`}
                title="Toggle Auto Guided Walkthrough (Space)"
              >
                {isAutoTourActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-300" />
                    <span>Pause Tour</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#dfc5a4]" />
                    <span>Auto Tour</span>
                  </>
                )}
              </button>

              {/* Enter / Step Inside button shortcut on Exterior */}
              {isExterior ? (
                <button
                  onClick={handleEnterProperty}
                  disabled={isEntering}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] hover:brightness-110 shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Footprints className="w-3.5 h-3.5 text-[#0c0d10]" />
                  <span>Step Inside</span>
                </button>
              ) : (
                /* Room Jump Quick Pill */
                <button
                  onClick={() => setShowFloorPlan((prev) => !prev)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-stone-300 cursor-pointer"
                  title="View all rooms"
                >
                  <Compass className="w-3.5 h-3.5 text-[#dfc5a4]" />
                  <span>{currentRoom.name}</span>
                </button>
              )}

              {/* Toggle Hotspots */}
              <button
                onClick={() => setShowHotspots((prev) => !prev)}
                className={`p-2 sm:p-2.5 rounded-full border transition-all cursor-pointer ${
                  showHotspots
                    ? 'bg-[#c8a97e]/20 text-[#dfc5a4] border-[#c8a97e]/40'
                    : 'bg-white/5 text-stone-400 border-white/10'
                }`}
                title={showHotspots ? 'Hide Navigation Hotspots (H)' : 'Show Navigation Hotspots (H)'}
              >
                {showHotspots ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Next Room Button */}
              <button
                onClick={handleNextRoom}
                className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                title="Next Room (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
