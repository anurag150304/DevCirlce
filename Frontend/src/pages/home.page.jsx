import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import AI from "../assets/png/AI.png";
import { Link } from "react-router-dom";

export const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById("features");
            if (section) {
                const rect = section.getBoundingClientRect();
                setIsVisible(rect.top < window.innerHeight * 0.8);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20">
                {/* Animated Title & Text */}
                <motion.div
                    className="max-w-lg text-center md:text-left"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="text-4xl md:text-5xl font-semibold text-blue-400">
                        Welcome to DevCircle Environment
                    </h2>
                    <p className="mt-4 text-gray-300">
                        Your all-in-one platform for collaborative coding, AI-assisted
                        development, and private group discussions. Build, chat, and create
                        together in a seamless environment.
                    </p>
                    <div className="mt-6">
                        <Link to="/register" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer">
                            Get Started
                        </Link>
                        <a href="#features" className="ml-4 px-6 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition cursor-pointer">
                            Learn More
                        </a>
                    </div>
                </motion.div>

                {/* Animated AI Image */}
                <motion.div
                    className="mt-10 md:mt-0"
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2 }}
                >
                    <img src={AI} alt="AI Illustration" className="w-full md:w-96 lg:w-[30rem] rounded-lg" />
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-gray-800 py-16 px-8 mb-10">
                <h3 className="text-3xl font-bold text-blue-400 text-center">
                    Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    {["Code Generator", "Private Groups", "Chat with AI"].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-700 p-6 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 50 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.2 }}>
                            <h4 className="text-xl font-bold text-blue-400">{feature}</h4>
                            <p className="mt-2 text-gray-300">
                                {feature === "Code Generator" && "Generate and run code effortlessly with our AI-powered engine."}
                                {feature === "Private Groups" && "Collaborate in private groups with secure chat features."}
                                {feature === "Chat with AI" && "Get AI assistance for your coding challenges in real-time."}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};
