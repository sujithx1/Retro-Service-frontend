// import { createContext, useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// const SocketContext = createContext<Socket | null>(null);

// export const  SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const newSocket = io(SOCKET_URL);
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// };

// export default SocketContext;
