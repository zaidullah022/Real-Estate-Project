import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  Heart, 
  Calendar, 
  Home, 
  Trash2, 
  Sparkles 
} from 'lucide-react';

export interface Toast {
  id: string;
  type?: 'success' | 'info' | 'error' | 'favorite';
  title: string;
  message: string;
  icon?: 'property' | 'booking' | 'favorite' | 'trash' | 'profile' | 'general';
  duration?: number;
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </aside>
  );
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.icon) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-[#dfc5a4]" />;
      case 'property':
        return <Home className="w-4 h-4 text-[#dfc5a4]" />;
      case 'favorite':
        return <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />;
      case 'trash':
        return <Trash2 className="w-4 h-4 text-rose-400" />;
      case 'profile':
        return <Sparkles className="w-4 h-4 text-[#dfc5a4]" />;
      default:
        if (toast.type === 'error') return <AlertCircle className="w-4 h-4 text-rose-400" />;
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 15, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className="pointer-events-auto relative overflow-hidden bg-[#12141a]/95 backdrop-blur-2xl border border-[#c8a97e]/30 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-start gap-3.5 group"
    >
      {/* Icon Pill */}
      <div className="w-8 h-8 rounded-xl bg-[#1a1d26] border border-white/10 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        {getIcon()}
      </div>

      {/* Text Info */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="font-serif font-bold text-white text-xs tracking-tight">
          {toast.title}
        </h4>
        <p className="text-[11px] text-stone-300 font-light leading-relaxed mt-0.5">
          {toast.message}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        title="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Subtle Bottom Progress Indicator */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration || 4500) / 1000, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#dfc5a4] via-[#c8a97e] to-[#8c734b]"
      />
    </motion.div>
  );
};
