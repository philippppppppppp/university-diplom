import { Flex, IconButton } from "@chakra-ui/react";
import { ThemeSwitchButton } from "../../features/switch-theme";
import { LanguageSelect } from "../../features/select-language";
import { useRedirect } from "../../shared/redirect";
import { ArrowBackIcon } from "@chakra-ui/icons";

export const MinimalHeader: React.FC = () => {
  const redirect = useRedirect();

  return (
    <Flex p="4" alignItems="center" justifyContent="space-between">
      <IconButton
        icon={<ArrowBackIcon />}
        onClick={redirect}
        aria-label="Back"
      />
      <Flex gap={2}>
        <ThemeSwitchButton />
        <LanguageSelect />
      </Flex>
    </Flex>
  );
};
