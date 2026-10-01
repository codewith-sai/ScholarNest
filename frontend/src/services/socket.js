import { io } from "socket.io-client";

let socket = null;

const getSocketUrl = () => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  if (socketUrl) {
    return socketUrl.replace(/\/+$/, "");
  }

  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl) {
    return apiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  }

  return "http://localhost:5000";
};

export const connectSocket = (user) => {
  if (!user) return null;

  // Reuse an existing connection
  if (socket?.connected) {
    return socket;
  }

  // Clean up an old socket instance
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("scholarnet_token") ||
    localStorage.getItem("authToken");

  socket = io(getSocketUrl(), {
    autoConnect: true,
    transports: ["websocket", "polling"],
    auth: {
      token,
      userId: user._id || user.id,
      userName: user.name || user.fullName || user.email,
      role: user.role,
    },
  });

  socket.on("connect", () => {
    console.log("ScholarNet socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("ScholarNet socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("ScholarNet socket connection error:", error.message);
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = () => {
  return Boolean(socket?.connected);
};

export default {
  connectSocket,
  getSocket,
  disconnectSocket,
  isSocketConnected,
};