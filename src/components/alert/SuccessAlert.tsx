import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000); // Auto close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
    >
      <CheckCircleIcon className="w-6 h-6 text-white" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-lg font-bold">
        &times;
      </button>
    </motion.div>
  );
};

export default SuccessAlert;
