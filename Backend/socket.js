import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import userModel from "./models/user.model.js";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import * as genieService from "./services/genie.service.js";

let io;

// Function to initialize Socket.IO
export const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: ["https://dev-cirlce.vercel.app", "http://localhost:5173"],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    });

    io.use(async (socket, next) => {
        console.log(`Socket connected: ${socket.id}`);
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
        if (!token) return next(new Error("No token provided."));

        const projectId = socket.handshake.query.projectId;
        if (!projectId) return next(new Error("No project ID provided."));
        if (!mongoose.Types.ObjectId.isValid(projectId)) return next(new Error("Invalid project ID provided."));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return next(new Error("Invalid token provided."));

        const user = await userModel.findOne({ email: decoded.email }).select("-password");
        const project = await projectModel.findById(projectId).populate("users", "-password");
        if (!user || !project) return next(new Error("No user or project found."));

        socket.user = user;
        socket.project = project;
        next();
    });

    io.on("connection", (socket) => {
        const roomId = socket.project._id.toString();
        socket.join(roomId);

        socket.on("message", async (data) => {
            const user = await userModel.findById(data.sender).select("-password");
            if (!user) return;
            socket.broadcast.to(roomId).emit("project-message", { sender: user, message: data.message });

            if (data.message.includes("@genie")) {
                const prompt = data.message.replace("@genie", "").trim();
                const result = await genieService.generateContent(prompt);
                io.to(roomId).emit("project-message", { sender: { fullname: { firstname: "Genie AI" } }, message: result });
                return;
            }
        });
        socket.on("disconnect", () => {
            socket.leave(roomId);
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};