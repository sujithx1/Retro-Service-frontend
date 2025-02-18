import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify"; // Install this package
import "react-toastify/dist/ReactToastify.css";
import socket from "../../socket/socket";
import { EmployeeStateTypes } from "../../types/employee/EmployeeTypes";

interface Props{
  employee:EmployeeStateTypes
}

const BookingNotification:FC<Props> = ({ employee }) => {
  const [notifications, setNotifications] = useState<{ serviceName?: string }[]>([]);

  useEffect(() => {
    socket.on("bookingNotification", (booking: { employeeId?: string; serviceName?: string }[] | null) => {
      if (!Array.isArray(booking)) return; // Ensure booking is an array

      const matchedBooking = booking.find((emp) => emp?.employeeId === employee?.id);

      if (matchedBooking) {
        console.log("Received New Booking:", matchedBooking);
        setNotifications((prev) => [...prev, matchedBooking]);

        // Play notification sound
        const audio = new Audio("/notification.mp3"); // Place this file in 'public' folder
        audio.play();

        // Show toast notification
        toast.info(`New Booking: ${matchedBooking.serviceName || "Unknown Service"}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });

    return () => {
      socket.off("bookingNotification");
    };
  }, [employee?.id]);

  return (
    <div>
      <h3>Live Notifications</h3>
      {notifications.map((notif, index) => (
        <div key={index} className="p-2 bg-blue-100 rounded-md my-2">
          🚀 {notif.serviceName || "New Booking!"}
        </div>
      ))}
    </div>
  );
};

export default BookingNotification;
