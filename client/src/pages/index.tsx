import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { PrivateRoute, useAuth } from "../shared/auth";
import { HomePage } from "./home-page";
import { LoginPage } from "./login-page";
import { RegisterPage } from "./register-page";
import { ActivationPage } from "./activation-page";
import { EstateListPage } from "./estate-list";
import { CreateEstatePage } from "./create-estate";
import { EstateItemPage } from "./estate-item";
import { EstateFavoritesListPage } from "./estate-favorites-list";
import { EstateCreatedByUserListPage } from "./estate-created-by-user-list";

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
      path: "/estate/favorites",
      element: (
        <PrivateRoute>
          <EstateFavoritesListPage />
        </PrivateRoute>
      ),
    },
    {
      path: "/estate/my",
      element: (
        <PrivateRoute>
          <EstateCreatedByUserListPage />
        </PrivateRoute>
      ),
    },
    {
      path: "/estate/new",
      element: (
        <PrivateRoute>
          <CreateEstatePage />
        </PrivateRoute>
      ),
    },
    {
      path: "/estate/:id",
      element: <EstateItemPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};
