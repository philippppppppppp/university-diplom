import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useTranslation } from "../../shared/translations";

export const LanguageSelect: React.FC = () => {
  const { selectLanguage, selectedLanguage } = useTranslation();
  return (
    <Menu>
      <MenuButton as={Button} leftIcon={<ChevronDownIcon />}>
        {selectedLanguage === "uk" ? "Українська" : "Русский"}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => selectLanguage("uk")}>Українська</MenuItem>
        <MenuItem onClick={() => selectLanguage("ru")}>Русский</MenuItem>
      </MenuList>
    </Menu>
  );
};
