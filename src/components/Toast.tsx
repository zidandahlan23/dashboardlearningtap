import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const config: Record<ToastType, { icon: typeof CheckCircle; bg: string; border: string; iconColor: string }> = {
  success: {
    icon: CheckCircle,
    bg: 'bg-[#4A7C59]/10',
    border: 'border-[#4A7C59]/20',
    iconColor: 'text-[#4A7C59]',
  },
  error: {
    icon: XCircle,
    bg: 'bg-[#B84A3E]/10',
    border: 'border-[#B84A3E]/20',
    iconColor: 'text-[#B84A3E]',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-[#E09F3E]/10',
    border: 'border-[#E09F3E]/20',
    iconColor: 'text-[#E09F3E]',
  },
  info: {
    icon: Info,
    bg: 'bg-[#5B8BA0]/10',
    border: 'border-[#5B8BA0]/20',
    iconColor: 'text-[#5B8BA0]',
  },
};

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const { icon: Icon, bg, border, iconColor } = config[type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bg} border ${border} shadow-lg animate-in slide-in-from-top-2 fade-in duration-300`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
      <p className="text-[13px] text-[#2C3531] flex-1">{message}</p>
      <button
        onClick={onClose}
        className="w-6 h-6 rounded-md flex items-center justify-center text-[#8A938B] hover:bg-white/50 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
