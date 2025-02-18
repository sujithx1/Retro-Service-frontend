import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import socket from "../../socket/socket";


interface Notification {
  message: string;
  type?: "success" | "error" | "info";
}

const NotificationToast: React.FC = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    socket.on("bookingNotification", (booking) => {
      setNotification({
        message: `New booking request: ${booking.userName} requested ${booking.serviceType}`,
        type: "success",
      });

      setTimeout(() => setNotification(null), 4000); // Hide after 4s
    });

    return () => {
      socket.off("bookingNotification");
    };
  }, []);

  if (!notification) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 flex items-center px-5 py-3 rounded-lg shadow-lg bg-green-600 text-white transition-all z-50"
    >
      <CheckCircleIcon className="w-6 h-6 mr-2 text-white" />
      <span className="text-sm font-medium">{notification.message}</span>
      <button onClick={() => setNotification(null)} className="ml-4 text-white">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default NotificationToast;
