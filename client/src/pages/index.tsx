import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useAuth } from "../shared/auth";
import { HomePage } from "./home-page";
import { LoginPage } from "./login-page";
import { RegisterPage } from "./register-page";
import { ActivationPage } from "./activation-page";
import { EstateListPage } from "./estate-list";
import { SellPage } from "./sell";
import { EstateItemPage } from "./estate-item";

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
    {
      path: "/activate/:token",
      element: <ActivationPage />,
    },
    {
      path: "/estate",
      element: <EstateListPage />,
    },
    {
      path: "/estate/new",
      element: authenticated ? <SellPage /> : <Navigate to="/register" />,
    },
    {
      path: "/estate/:id",
      element: <EstateItemPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};
