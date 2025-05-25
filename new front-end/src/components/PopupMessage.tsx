import React, { useEffect } from "react";

interface PopupMessageProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
}

const PopupMessage: React.FC<PopupMessageProps> = ({ 
  message, 
  onClose, 
  type = 'success',
  title 
}) => {
  // Handle escape key to close popup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Focus management - focus the close button when popup opens
  useEffect(() => {
    const closeButton = document.getElementById('popup-close-btn');
    if (closeButton) {
      closeButton.focus();
    }
  }, []);

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Dynamic styling based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          titleColor: 'text-green-700',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          defaultTitle: 'Success'
        };
      case 'error':
        return {
          titleColor: 'text-red-700',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          defaultTitle: 'Error'
        };
      case 'warning':
        return {
          titleColor: 'text-yellow-700',
          buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
          defaultTitle: 'Warning'
        };
      case 'info':
        return {
          titleColor: 'text-blue-700',
          buttonBg: 'bg-blue-600 hover:bg-blue-700',
          defaultTitle: 'Information'
        };
      default:
        return {
          titleColor: 'text-green-700',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          defaultTitle: 'Success'
        };
    }
  };

  const styles = getTypeStyles();
  const displayTitle = title || styles.defaultTitle;

  return (
    <div 
      className="fixed inset-0 bg-transparent flex justify-center items-center z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-labelledby="popup-title"
      aria-describedby="popup-message"
      aria-modal="true"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg px-8 py-6 max-w-sm w-full mx-4 text-center animate-in slide-in-from-top-4 duration-300">
        <div 
          id="popup-title" 
          className={`mb-3 text-xl font-bold ${styles.titleColor}`}
        >
          {displayTitle}
        </div>
        <div 
          id="popup-message" 
          className="mb-5 text-gray-100 text-base leading-relaxed"
        >
          {message}
        </div>
        <button
          id="popup-close-btn"
          className={`px-6 py-2 rounded-lg ${styles.buttonBg} text-white font-semibold transition-colors shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
          onClick={onClose}
          autoFocus
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PopupMessage;