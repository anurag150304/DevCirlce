import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Logout = () => {
    const { setUser } = useContext(UserContext);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setError("");
        setSuccess("");

        async function Logout() {
            const token = localStorage.getItem("authToken");
            if (!token) return navigate("/login");
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status === 200) {
                    localStorage.removeItem("authToken");
                    setSuccess("Logged out successfully. Redirecting.....");
                    setUser(null);
                    setTimeout(() => navigate("/"), 2000);
                }
            } catch (error) {
                setError(error.response.data.message || "Failed to logout");
            }
        }
        Logout();
    }, [])
    return (

        <div className="h-screen w-screen flex flex-col justify-start items-center p-8 bg-gray-800">
            {error && (
                <div className="p-2 text-sm text-red-500 bg-red-800 rounded-md w-1/2 text-center">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-2 text-sm text-green-500 bg-green-800 rounded-md w-1/2 text-center">
                    {success}
                </div>
            )}
        </div>
    )
}
