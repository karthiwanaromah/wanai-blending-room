import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_BASE_URL;
export const socket = io(baseUrl, {
  withCredentials: true,
});
