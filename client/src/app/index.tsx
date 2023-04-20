import { RouterProvider } from "react-router-dom";
import { router } from "../pages";
import { ComposedProviders } from "./providers";

export const App: React.FC = () => {
  return (
    <ComposedProviders>
      <RouterProvider router={router} />
    </ComposedProviders>
  );
};
