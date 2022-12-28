import { createContext } from "react";
import socketio from "socket.io-client";

const { username } = localStorage;

// TODO: store this url in a .env file
export const socket = username
  ? socketio.connect("ws://localhost:4000", {
      query: { username },
      transports: ["websocket"],
    })
  : socketio.connect("ws://localhost:4000");

export const SocketContext = createContext();
