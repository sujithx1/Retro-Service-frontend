import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ToastAlertProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const ToastAlert: React.FC<ToastAlertProps> = ({ message, type = "success", onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Delay unmount for smooth exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  // Toast styles based on type
  const toastStyles = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 flex items-center px-5 py-3 rounded-lg shadow-lg ${toastStyles[type]} transition-all z-50`}
    >
      <CheckCircleIcon className="w-6 h-6 mr-2 text-white" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-white">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default ToastAlert;
