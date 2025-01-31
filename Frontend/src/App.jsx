import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/home.page";
import { Login } from "./pages/login.page";
import { Register } from "./pages/register.page";
import { UserProtectedWrapper } from "./utils/userProtectedWrapper";
import { Projects } from "./pages/projects.page";
import { Dashboard } from "./pages/dashboard.page";
import { Logout } from "./pages/logout.page";
import { AuthProtectWrapper } from "./utils/authProtectWrapper";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <AuthProtectWrapper><Home /></AuthProtectWrapper> },
    { path: "/register", element: <AuthProtectWrapper><Register /></AuthProtectWrapper> },
    { path: "/login", element: <AuthProtectWrapper><Login /></AuthProtectWrapper> },
    { path: "/logout", element: <UserProtectedWrapper><Logout /></UserProtectedWrapper> },
    { path: "/home", element: <UserProtectedWrapper><Projects /></UserProtectedWrapper> },
    { path: "/dashboard", element: <UserProtectedWrapper><Dashboard /></UserProtectedWrapper> },
  ])
  return (<RouterProvider router={router} />)
}

export default App
