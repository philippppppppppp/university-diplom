import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { HomePage } from "./home-page";
import { LoginPage } from "./login-page/LoginPage";
import { useAuth } from "../shared/auth";
import { RegisterPage } from "./register-page/RegisterPage";
import { ActivationPage } from "./activation-page";
import { Sell } from "./sell";
import { EstateListPage } from "./list";
import { ItemPage } from "./item/ItemPage";

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
      element: authenticated ? <Sell /> : <Navigate to="/register" />,
    },
    {
      path: "/estate/:id",
      element: <ItemPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};
