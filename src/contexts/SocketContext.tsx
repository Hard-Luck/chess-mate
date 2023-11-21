import { createContext } from "react";
import { Socket } from "socket.io-client";

export type SocketContextType = Socket | null;

export const SocketContext = createContext<SocketContextType>(null);
