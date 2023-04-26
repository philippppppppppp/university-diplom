import { Show } from "@chakra-ui/react";
import { Desktop } from "./components/Desktop";
import { Mobile } from "./components/Mobile";

export const Header: React.FC = () => {
  return (
    <>
      <Show above="md">
        <Desktop />
      </Show>
      <Show below="md">
        <Mobile />
      </Show>
    </>
  );
};
