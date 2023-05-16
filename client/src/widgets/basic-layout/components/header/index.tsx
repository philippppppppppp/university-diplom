import { Show } from "@chakra-ui/react";
import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";

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
