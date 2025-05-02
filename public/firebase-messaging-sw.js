/* public/firebase-messaging-sw.js */

self.addEventListener('message', (event) => {
  console.log("message delayyy");
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log("skipp   waiting ........... delayyy");

    self.skipWaiting();
  }
});

importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDUJ8ThDfGOhS6RjRXhO_7Peaun6rhmOiA",
  authDomain:"retro-service.firebaseapp.com",
  projectId:"retro-service",
  messagingSenderId:"950638929085",
  appId:"1:950638929085:web:fdf465558a45d26028c3d4",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: '/fbe2f637-dd1a-45c6-a204-8a8aa56a6ff8_afkjeq.png',
  });
});
