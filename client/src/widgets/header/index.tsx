import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "../../shared/translations";

export const Header: React.FC = () => {
  const { t, selectLanguage, selectedLanguage } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const color = isDark ? "white" : "black";
  return (
    <Box bgColor={isDark ? "gray.600" : "gray.100"} boxShadow="md">
      <Container maxW="1000">
        <Flex
          h="100"
          justifyContent="space-between"
          alignItems="center"
          as="nav"
        >
          <CheckCircleIcon color={color} boxSize="6" />
          <Menu>
            <MenuButton as={Button} fontSize="20" variant="link" color={color}>
              {t("buy")}
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/buy/flat">
                {t("buy_flat")}
              </MenuItem>
              <MenuItem as={Link} to="/buy/house">
                {t("buy_house")}
              </MenuItem>
            </MenuList>
          </Menu>
          <Button
            as={Link}
            fontSize="20"
            to="/sell"
            variant="link"
            color={color}
          >
            {t("sell")}
          </Button>
          <Flex gap={8}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />
            <Menu>
              <MenuButton
                as={Button}
                color={color}
                leftIcon={<ChevronDownIcon />}
              >
                {selectedLanguage === "uk" ? "Українська" : "Русский"}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => selectLanguage("uk")}>
                  Українська
                </MenuItem>
                <MenuItem onClick={() => selectLanguage("ru")}>
                  Русский
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
