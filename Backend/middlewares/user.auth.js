import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import redisClient from "../services/redis.service.js";

async function userAuth(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access Denied! No token provided." });

    try {
        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) return res.status(403).json({ message: "Token is blacklisted. Please log in again." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Access Denied! Invalid Token" });
    }
}

export default userAuth;
