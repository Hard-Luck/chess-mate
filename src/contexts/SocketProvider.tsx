import React, { useState, useEffect, PropsWithChildren } from "react";
import { io } from "socket.io-client";
import { SocketContext, SocketContextType } from "./SocketContext";

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<SocketContextType>(null);

  useEffect(() => {
    const newSocket = io("https://chess-mate-server.onrender.com");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
