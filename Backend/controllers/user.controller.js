import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import redisClient from "../services/redis.service.js";

export const registerUser = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ errors: error.array() });
    const { firstname, lastname, email, password } = req.body;

    try {
        const userExists = await userModel.findOne({ email });
        if (userExists) return res.status(401).json({ message: 'User already exist' });

        const newUser = await userService.createUser(firstname, lastname, email, password);
        delete newUser._doc.password;
        const token = await newUser.generateAuthToken();

        res.status(201).json({ token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) return res.status(400).json({ errors: error.array() });
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) return res.status(401).json({ message: "Invalid credentials" });

        const token = await user.generateAuthToken();
        delete user._doc.password;
        res.cookie("token", token);
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const logoutUser = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    try {
        await redisClient.set(token, "blacklisted", "EX", 60 * 60 * 24);
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: "Server error", message: error.message });
    }
}

export const userProfile = (req, res) => {
    res.status(200).json(req.user);
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.user._id);
        return res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}