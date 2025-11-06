import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";

export async function createProject(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const newProject = await projectService.createProject(req.body.name, req.user._id);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function getProjectInfo(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const project = await projectService.getProjectInfo(req.query.projectId);
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function getProjects(req, res) {
    try {
        const projects = await projectService.getAllProjects(req.user._id);
        res.status(200).json(projects);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function addUserToProject(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const projectDetails = await projectService.addUserToProject(req.body.projectId, req.body.users, req.user._id);
        res.status(200).json(projectDetails);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function updateFileTree(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const projectDetails = await projectService.updateFileTree(req.body.projectId, req.body.fileTree, req.user._id);
        res.status(200).json(projectDetails);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteProject(req, res) {
    try {
        await projectService.deleteProject(req.params.projectId, req.user._id);
        res.status(200).json({ message: "Project deleted successfully!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
