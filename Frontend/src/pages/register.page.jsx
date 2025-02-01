import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

export const Register = () => {
    const [formData, setFormData] = useState({ firstname: "", lastname: "", email: "", password: "", });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, formData);
            setSuccess(response.data.message || "Registration successful! You can now login.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen items-start justify-center bg-gray-900 text-white">
            <AnimatePresence>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md mx-6 my-16 lg:my-10">
                    <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
                    {error && (
                        <div className="p-2 text-sm text-red-500 bg-red-800 rounded-md">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-2 text-sm text-green-500 bg-green-800 rounded-md">
                            {success}
                        </div>
                    )}
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="flex flex-row justify-center items-center gap-4">
                            <div>
                                <label htmlFor="firstname" className="block text-sm font-medium">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastname" className="block text-sm font-medium">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 mt-1 text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full p-3 mt-1 text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute bottom-3 right-3 flex items-center text-gray-600">
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 text-lg font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300"
                        >
                            Register
                        </button>
                    </form>
                    <p className="text-center text-sm cursor-pointer">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-400 hover:underline">
                            Login
                        </button>
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};