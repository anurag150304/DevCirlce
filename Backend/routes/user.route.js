import express from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller.js";
import userAuth from "../middlewares/user.auth.js";

const router = express.Router();

router.post("/register",
    body("firstname").isString().withMessage("First name must be a string"),
    body("lastname").isString().withMessage("Last name must be a string"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isString().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    userController.registerUser);

router.post("/login",
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isString().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    userController.loginUser);

router.get("/profile", userAuth, userController.userProfile);
router.get("/logout", userAuth, userController.logoutUser);

router.get("/all", userAuth, userController.getAllUsers);

export default router;