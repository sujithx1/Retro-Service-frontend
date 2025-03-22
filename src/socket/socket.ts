import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  // autoConnect: false - Remove this line
});

export default socket;
