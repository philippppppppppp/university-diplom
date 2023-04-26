import { Routes } from "../pages";
import { ComposedProviders } from "./providers";

export const App: React.FC = () => {
  return (
    <ComposedProviders>
      <Routes />
    </ComposedProviders>
  );
};
