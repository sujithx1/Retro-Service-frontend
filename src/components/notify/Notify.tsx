import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({
  duration: 3000, // Notification duration
  position: { x: "right", y: "top" }, // Position of notification
  types: [
    {
      type: "success",
      background: "green",
      icon: false,
    },
    {
      type: "error",
      background: "red",
      icon: false,
    },
  ],
});

// Function to play notification sound
const playNotificationSound = () => {
  const audio = new Audio("/notification.mp3"); // Replace with your sound file path
  audio.play();
};

// Function to show notification with sound
const showNotification = (type: "success" | "error", message: string) => {
  playNotificationSound();
  notyf.open({ type, message });
};

// Example Usage:
showNotification("success", "New booking received!");
showNotification("error", "Failed to send request!");
