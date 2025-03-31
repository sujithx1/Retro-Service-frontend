// import { useEffect } from "react";
// // import { messaging, getToken, onMessage } from "../../firebase/firstore"; // Import Firebase config

// const NotificationComponent = () => {
//   useEffect(() => {
//     const requestNotificationPermission = async () => {
//       try {
//         const permission = await Notification.requestPermission();
//         if (permission === "granted") {
//           console.log("Notification permission granted.");
//           const token = await getToken(messaging);
//           console.log("FCM Token:", token);
//         } else {
//           console.log("Notification permission denied.");
//         }
//       } catch (error) {
//         console.error("Error getting notification permission:", error);
//       }
//     };

//     requestNotificationPermission();

//     // Handle incoming messages safely
//     onMessage(messaging, (payload) => {
//       console.log("Message received:", payload);

//       if (payload.notification) {
//         const { title, body } = payload.notification;
        
//         // Show a browser notification
//         new Notification(title || "New Notification", {
//           body: body || "You have a new message.",
//         });
//       } else {
//         console.warn("Received message without notification:", payload);
//       }
//     });
//   }, []);

//   return <div>Notification Component</div>;
// };

// export default NotificationComponent;
