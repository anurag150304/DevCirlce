import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import User from "../assets/png/user.png";
import { UserContext } from "../context/user.context";

export const Projects = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [isClicked, setIsClicked] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // Fetch projects from backend
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/projects/get-projects`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                });
                setProjects(response.data);
            } catch (error) {
                showToast("Failed to fetch projects!", "error");
            }
        };
        fetchProjects();
    }, []);

    const handleCreateProject = async () => {
        if (!projectName.trim()) return showToast("Project name is required!", "error");

        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/projects/create`,
                { name: projectName },
                { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
            );

            if (response.status === 201) {
                setProjects(prev => [...prev, response.data]);
                setProjectName("");
                setIsModalOpen(false);
                showToast("Project created successfully!", "success");
            } else {
                showToast(response.data.message || "Error creating project!", "error");
            }
        } catch (err) {
            showToast("Something went wrong!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/projects/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });

            if (response.status === 200) {
                setProjects((prev) => prev.filter((project) => project._id !== id));
                showToast(response.data.message, "success");
            } else {
                showToast(response.data.message, "error");
            }
        } catch (err) {
            showToast("Something went wrong!", "error");
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) =>
            sortOrder === "newest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt)
        );

    return (
        <>
            <div className="bg-gray-900 text-white min-h-screen p-6">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold text-blue-400">Your Projects</h1>
                    <div className="flex flex-row justify-center items-center gap-4">
                        <i className="ri-user-4-line text-2xl px-2 py-1 rounded-full hover:bg-gray-700 transition duration-200 cursor-pointer"
                            onClick={() => setIsClicked(!isClicked)} />
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 md:mt-0 px-4 py-2 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600 transition">
                            Create Project
                        </button>
                    </div>
                </header>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row justify-start items-center mb-6 gap-4">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="p-3 rounded-lg bg-gray-800 text-white">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                {/* Project List */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div
                            key={project._id}
                            className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 text-center transform hover:scale-105">
                            <i className="ri-delete-bin-7-line absolute top-2 right-3 cursor-pointer hover:scale-125 transition duration-300"
                                onClick={() => handleDeleteProject(project._id)} />
                            <h3 className="text-2xl font-bold text-blue-400 mb-2">{project.name}</h3>
                            <p className="text-sm text-gray-300 mb-1">
                                <span className="font-semibold text-gray-100">Created:</span> {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-300 flex items-center justify-center gap-1 mb-4">
                                <i className="ri-team-fill text-gray-100" />
                                <span className="font-semibold text-gray-100">Collaborators:</span> {project.users.length}
                            </p>
                            <button
                                onClick={() => navigate('/dashboard', { state: { project } })}
                                className="px-6 py-2 bg-blue-600 rounded-full text-white font-medium shadow-lg hover:bg-blue-500 transition duration-200">
                                Open
                            </button>
                        </div>
                    ))}
                </section>


                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative m-4">
                                <h2 className="text-2xl font-bold text-blue-400 mb-4">Create Project</h2>
                                <input
                                    type="text"
                                    name="projectName"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Enter project name"
                                    className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="mt-4 flex justify-end space-x-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateProject}
                                        className="px-4 py-2 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600 transition flex items-center"
                                    >
                                        {loading && <span className="loader mr-2" />} Create
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {isClicked && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative m-4">
                                <i className="ri-close-large-line absolute top-3 right-4 text-lg cursor-pointer transition-all duration-300 hover:scale-110"
                                    onMouseEnter={(e) => (e.target.style.textShadow = "0px 0px 8px white")}
                                    onMouseLeave={(e) => (e.target.style.textShadow = "none")}
                                    onClick={() => setIsClicked(false)}
                                />
                                <h2 className="text-3xl font-bold text-blue-400 mb-4 text-center">Account</h2>
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div>
                                        <img src={User} alt="user.png" className="w-20 rounded-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl text-center">{user.fullname.firstname} {user.fullname.lastname}</h3>
                                        <p className="font-light">{user.email}</p>
                                    </div>
                                    <button className="px-6 py-2 bg-red-600 rounded-lg text-white font-medium shadow-lg hover:bg-red-500 transition duration-200"
                                        onClick={() => {
                                            setIsClicked(false);
                                            navigate('/logout');
                                        }}>Logout</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Toast Notifications */}
                {toast.show && (
                    <div
                        className={`fixed top-4 right-4 p-4 rounded-lg text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {toast.message}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};