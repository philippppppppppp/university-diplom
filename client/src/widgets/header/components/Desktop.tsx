import {
  Box,
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../shared/translations";
import { AuthButton } from "../../../features/auth";
import { LanguageSelect } from "../../../features/select-language";
import { ThemeSwitchButton } from "../../../features/switch-theme";

export const Desktop: React.FC = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  return (
    <Box
      bgColor={colorMode === "dark" ? "gray.600" : "gray.100"}
      boxShadow="md"
    >
      <Container maxW="container.lg">
        <Flex
          h="80px"
          justifyContent="space-between"
          alignItems="center"
          as="nav"
        >
          <CheckCircleIcon boxSize="6" />
          <Menu>
            <MenuButton as={Button} fontSize="20" variant="link">
              {t("buy")}
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/estate?type=flat">
                {t("buy_flat")}
              </MenuItem>
              <MenuItem as={Link} to="/estate?type=house">
                {t("buy_house")}
              </MenuItem>
            </MenuList>
          </Menu>
          <Button as={Link} fontSize="20" to="/estate/new" variant="link">
            {t("sell")}
          </Button>
          <Flex gap={8}>
            <ThemeSwitchButton />
            <LanguageSelect />
            <AuthButton withPopUp />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
