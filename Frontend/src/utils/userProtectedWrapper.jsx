import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingBar from "../components/LoadingBar.jsx";

export const UserProtectedWrapper = ({ children }) => {
    const { setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function Protect() {
            const token = localStorage.getItem("authToken");
            if (!token) {
                navigate("/login", { state: { from: location } });
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err || "An error occurred. Please try again...");
                localStorage.removeItem("authToken");
                navigate("/login", { state: { from: location } });
            }
        }
        Protect();
    }, [setUser, navigate, location]);

    if (loading) return (<LoadingBar />);
    return (<>{children}</>);
}
