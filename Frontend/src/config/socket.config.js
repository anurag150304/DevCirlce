import { io } from "socket.io-client";

let socket;
export const InitializeSocket = (projectId) => {
    socket = io(import.meta.env.VITE_BASE_URL, {
        auth: { token: localStorage.getItem("authToken") },
        query: { projectId }
    });

    socket.on("connect");

    socket.on("disconnect");

    return () => {
        socket.disconnect();
    };
}

export const sendMessage = (eventName, data) => {
    if (socket) {
        socket.emit(eventName, data);
    } else {
        console.error("Socket not connected");
    }
};

export const receiveMessage = (eventName, callback) => {
    if (socket) {
        socket.on(eventName, callback);
    } else {
        console.error("Socket not connected");
    }
};

export const removeMessage = (eventName, callback) => {
    if (socket) {
        socket.off(eventName, callback);
    } else {
        console.error("Socket not connected");
    }
};
