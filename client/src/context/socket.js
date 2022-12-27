import { createContext } from "react";
import socketio from "socket.io-client";

const userName = localStorage;

// Users can be anonymous or "logged in" (have set a username in localstorage)
// TODO: store this url in a .env file
export const socket = userName ? socketio.connect("http://localhost:4000", {
  query: {userName}
}) : socketio.connect("http://localhost:4000")

export const SocketContext = createContext();