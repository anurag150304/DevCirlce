import express from "express";
import { body, query } from "express-validator";
import userAuth from "../middlewares/user.auth.js";
import * as projectController from "../controllers/project.controller.js";

const router = express.Router();

router.post('/create', userAuth,
    body("name").isString().withMessage("Project name is required"),
    projectController.createProject)

router.get("/project-info", userAuth,
    query("projectId").isString().withMessage("Project ID is required"),
    projectController.getProjectInfo);

router.get('/get-projects', userAuth, projectController.getProjects);

router.put("/add-user", userAuth,
    body("projectId").isString().withMessage("Project ID is required"),
    body("users").isArray({ min: 1 }).withMessage("Atleast one user is required").bail()
        .custom(users => users.every(user => typeof user === "string")).withMessage("User ID(s) must be string"),
    projectController.addUserToProject);

router.put("/update-file-tree", userAuth,
    body("projectId").isString().withMessage("Project ID is required"),
    body("fileTree").isObject().withMessage("File tree is required"),
    projectController.updateFileTree);

router.delete("/:projectId", userAuth,
    projectController.deleteProject);

export default router;