import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion"; // Import motion for animation

export const Header = () => {
    const location = useLocation();
    const hideComponent = ["/login", "/register"].includes(location.pathname);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-gray-800 shadow-lg p-4 flex flex-row items-center justify-between">
            {/* Logo & Hamburger Menu */}
            <div className="flex items-center justify-between w-full md:w-auto gap-16">
                <NavLink to="/" className="text-2xl font-bold text-blue-500">
                    DevCircle
                </NavLink>

                {/* Hamburger Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
                <nav className="hidden md:flex space-x-6">
                    <NavLink to="/features" className="text-gray-300 hover:text-white transition">
                        Features
                    </NavLink>
                    <NavLink to="/about" className="text-gray-300 hover:text-white transition">
                        About
                    </NavLink>
                    <NavLink to="/contact" className="text-gray-300 hover:text-white transition">
                        Contact
                    </NavLink>
                </nav>
            </div>

            <nav className="hidden md:flex space-x-6">
                <NavLink to="/login" className="text-gray-300 hover:text-white transition">
                    Login
                </NavLink>
                <NavLink to="/register" className="text-gray-300 hover:text-white transition">
                    Signup
                </NavLink>
            </nav>

            {/* Mobile Menu with Smooth Slide Down */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`absolute left-0 top-[60px] w-full bg-gray-800 shadow-lg md:hidden flex flex-col items-center space-y-4 py-4 ${isOpen ? "block" : "hidden"
                    }`}
            >
                <NavLink to="/features" className="text-gray-300 hover:text-white transition">
                    Features
                </NavLink>
                <NavLink to="/about" className="text-gray-300 hover:text-white transition">
                    About
                </NavLink>
                <NavLink to="/contact" className="text-gray-300 hover:text-white transition">
                    Contact
                </NavLink>
            </motion.div>

            {/* Login & Signup (Mobile) */}
            {!hideComponent && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`absolute left-0 top-[140px] w-full bg-gray-800 shadow-lg md:hidden flex flex-col items-center space-y-4 py-4 ${isOpen ? "block" : "hidden"
                        }`}
                >
                    <NavLink to="/login" className="text-gray-300 hover:text-white transition">
                        Login
                    </NavLink>
                    <NavLink to="/register" className="text-gray-300 hover:text-white transition">
                        Signup
                    </NavLink>
                </motion.div>
            )}
        </header>
    );
};
