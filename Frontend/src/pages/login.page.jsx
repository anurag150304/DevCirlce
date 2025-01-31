import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import { AnimatePresence, motion } from "framer-motion";

export const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const { setUser } = useContext(UserContext);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, data);
            const { token, user } = response.data;
            setUser(user);
            localStorage.setItem("authToken", token);
            setSuccess(`Welcome back, ${response.data.user.fullname.firstname}! Redirecting.....`);
            setTimeout(() => navigate("/home"), 2000);
        } catch (err) {
            setError(err.response.data.message || "Login failed. Please try again.");
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
                    className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md mx-6 my-16">
                    <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
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
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
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
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
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
                            className="w-full py-3 text-lg font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300">
                            Login
                        </button>
                    </form>
                    <p className="text-center text-sm cursor-pointer">
                        Don’t have an account?{" "}
                        <Link to="/register" className="text-blue-400 hover:underline cursor-pointer">
                            Create one
                        </Link>
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};