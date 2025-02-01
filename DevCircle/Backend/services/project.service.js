import e from "express";
import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async (projectName, userId) => {
    if (!projectName) {
        throw new Error('Project name is required');
    }
    if (!userId) {
        throw new Error('User ID is required');
    }

    try {
        return await projectModel.create({
            name: projectName,
            users: [userId]
        });
    } catch (error) {
        if (error.code === 11_000) throw new Error('Project name already exists');
        throw error;
    }
}

export const getProjectInfo = async (projectId) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project ID');
    }

    return await projectModel.findById(projectId).populate('users', 'fullname email');
}

export const getAllProjects = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    return await projectModel.find({ users: userId });
}

export const addUserToProject = async (projectId, users, userId) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    if (!userId) {
        throw new Error('Logged in user ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project ID');
    }

    if (!users || !Array.isArray(users) || users.length === 0) {
        throw new Error('Users array is required and cannot be empty');
    }

    if (!users.every(userId => mongoose.Types.ObjectId.isValid(userId) && typeof userId === "string")) {
        throw new Error('All user IDs must be valid MongoDB ObjectIDs and strings');
    }
    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    if (!project.users.includes(userId)) {
        throw new Error('You are not authorized to perform this action');
    }

    const newUsers = users.filter(user => !project.users.includes(user));
    if (newUsers.length === 0) throw new Error('Users already added to the project');

    project.users.push(...newUsers);
    await project.save();
    return project;
}

export const updateFileTree = async (projectId, fileTree, userId) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    if (!userId) {
        throw new Error('Logged in user ID is required');
    }

    if (!fileTree || typeof fileTree !== "object" || Object.keys(fileTree).length === 0) {
        throw new Error('File tree is required and cannot be empty');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project ID');
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    if (!project.users.includes(userId)) {
        throw new Error('You are not authorized to perform this action');
    }

    project.fileTree = fileTree;
    await project.save();
    return project;
}

export const deleteProject = async (projectId, userId) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    if (!userId) {
        throw new Error('Logged in user ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project ID');
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    if (!project.users.includes(userId)) {
        throw new Error('You are not authorized to perform this action');
    }

    await projectModel.findByIdAndDelete(projectId);
}