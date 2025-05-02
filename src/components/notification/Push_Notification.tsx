import React, { useEffect } from 'react';

interface NotificationProps {
  title: string;
  message: string;
  onClose: () => void;
}

const Push_Notification: React.FC<NotificationProps> = ({ title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-50 w-80 bg-gray-800 text-white rounded-xl shadow-lg px-5 py-4 animate-slide-in">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          className="text-white hover:text-gray-300 text-xl leading-none ml-4"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Push_Notification;
