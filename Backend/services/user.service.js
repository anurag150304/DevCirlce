import userModel from "../models/user.model.js";

export async function createUser(firstname, lastname, email, password) {
    if (!firstname || !lastname || !email || !password) throw new Error("All fields are required");
    const hashPassword = await userModel.hashPassword(password);
    return await userModel.create({
        fullname: { firstname, lastname },
        email,
        password: hashPassword
    });
}

export async function getAllUsers(logged_In_user) {
    if (!logged_In_user) throw new Error("User not logged in");
    return await userModel.find({ _id: { $ne: logged_In_user } });
}