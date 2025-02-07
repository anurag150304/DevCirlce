import { NavLink } from "react-router-dom"

export const Footer = () => {
    return (
        <footer className="bg-gray-800 py-6 mt-auto">
            <div className="text-center text-gray-400">
                <p>© 2025 DevCircle AI. All rights reserved.</p>
                <p>
                    Built with ❤️ by{" "}
                    <NavLink to="https://www.linkedin.com/in/anurag-mishra-283428164/" className="text-blue-500 hover:text-blue-400 transition">
                        Anurag Mishra
                    </NavLink>
                </p>
            </div>
        </footer>
    )
}
