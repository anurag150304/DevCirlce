import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthProtectWrapper = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    useEffect(() => {
        if (token) {
            navigate('/home');
        }
    }, []);

    if (token) return null;
    return (<>{children}</>)
}
