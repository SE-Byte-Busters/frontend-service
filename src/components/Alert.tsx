import { useEffect } from 'react';
import { Icon, LucideIconName } from '@/components/Icon';

export type AlertType = 'success' | 'error' | 'loading';
export type AlertPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface AlertProps {
  message: string;
  type: AlertType;
  position?: AlertPosition;
  duration?: number;
  onClose?: () => void;
}

interface AlertIconConfig {
  name: LucideIconName;
  className: string;
}

type AlertIconsConfig = {
  [key in AlertType]: AlertIconConfig;
};

export function Alert({
  message,
  type,
  position = 'bottom-right',
  duration = 3000,
  onClose,
}: AlertProps) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const alertClasses = {
    success: 'alert-success',
    error: 'alert-error',
    loading: 'alert-loading',
  };

  const iconConfig: AlertIconsConfig = {
    success: {
      name: 'CircleCheck',
      className: 'icon-success',
    },
    error: {
      name: 'TriangleAlert',
      className: 'icon-error',
    },
    loading: {
      name: 'LoaderCircle',
      className: 'icon-loading',
    },
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <section
      className={`fixed z-50 ${alertClasses[type]} ${positionClasses[position]}`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <Icon name={iconConfig[type].name} className={iconConfig[type].className} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 p-1 rounded-full hover:bg-black/10 focus:outline-none"
          aria-label="Close alert"
        >
          <Icon name="X" fontSize={16} />
        </button>
      )}
    </section>
  );
}
