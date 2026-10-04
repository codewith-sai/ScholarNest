import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL 
 ;

let socket = null;

/*
 * Create socket connection.
 *
 * Authentication/authorization is handled by the backend.
 * No JWT or user information is stored in localStorage
 * or manually added to the socket connection.
 */
export const connectSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error(
      "Socket connection error:",
      error?.message || error
    );
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

/*
 * Get the current socket instance.
 */
export const getSocket = () => {
  return socket;
};

/*
 * Disconnect socket.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/*
 * Subscribe to a socket event.
 */
export const onSocketEvent = (event, callback) => {
  if (!socket) {
    connectSocket();
  }

  socket.on(event, callback);

  return () => {
    socket?.off(event, callback);
  };
};

/*
 * Remove a socket event listener.
 */
export const offSocketEvent = (event, callback) => {
  socket?.off(event, callback);
};

/*
 * Send data through socket.
 */
export const emitSocketEvent = (event, data) => {
  if (!socket) {
    connectSocket();
  }

  socket.emit(event, data);
};

export default socket;