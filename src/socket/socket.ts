import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  // autoConnect: false - Remove this line
});

export default socket;
