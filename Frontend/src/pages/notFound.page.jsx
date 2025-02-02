import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import not_found from "../assets/png/not_found.png"

export const NotFound = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}>
            <h1 className="text-6xl font-bold text-blue-400">404</h1>
            <p className="mt-4 text-xl text-gray-300">
                Oops! The page you’re looking for doesn’t exist.
            </p>
            <p className="text-gray-500">It may have been moved or deleted.</p>

            <motion.img
                src={not_found}
                alt="Page Not Found"
                className="w-full max-w-sm mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
            />

            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                Go Back Home
            </Link>
        </motion.div>
    );
};