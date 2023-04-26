import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { HomePage } from "./home-page";
import { LoginPage } from "./login-page/LoginPage";
import { useAuth } from "../shared/auth";
import { RegisterPage } from "./register-page/RegisterPage";

export const Routes: React.FC = () => {
  const { authenticated } = useAuth();

  const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    {
      path: "/login",
      element: authenticated ? <Navigate to="/" /> : <LoginPage />,
    },
    {
      path: "/register",
      element: authenticated ? <Navigate to="/" /> : <RegisterPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};
