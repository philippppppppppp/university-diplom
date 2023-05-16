import {
  Box,
  Container,
  Flex,
  IconButton,
  useColorMode,
  Drawer,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerBody,
  Divider,
  Link as LinkUi,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../../shared/translations";
import { AuthButton } from "../../../../features/auth";
import { LanguageSelect } from "../../../../features/select-language";
import { ThemeSwitchButton } from "../../../../features/switch-theme";

export const Mobile: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { colorMode } = useColorMode();
  return (
    <Box
      bgColor={colorMode === "dark" ? "gray.600" : "gray.100"}
      boxShadow="md"
    >
      <Container maxW="container.lg">
        <Flex
          h="75"
          justifyContent="space-between"
          alignItems="center"
          as="nav"
        >
          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Open menu"
            onClick={onOpen}
          />
          <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <Container maxW="container.lg">
                <Flex h="75" alignItems="center" justifyContent="space-between">
                  <IconButton
                    icon={<CloseIcon />}
                    aria-label="Close menu"
                    onClick={onClose}
                  />
                  <AuthButton />
                </Flex>
              </Container>
              <Divider />
              <DrawerBody as={Flex} direction="column" fontSize="18">
                <LinkUi as={Link} to="/">
                  {t("homePage")}
                </LinkUi>
              </DrawerBody>
              <Divider />
              <DrawerBody as={Flex} direction="column" fontSize="18">
                <LinkUi as={Link} to="/estate">
                  {t("buyAll")}
                </LinkUi>
                <LinkUi as={Link} to="/estate?type=flat">
                  {t("buyFlat")}
                </LinkUi>
                <LinkUi as={Link} to="/estate?type=house">
                  {t("buyHouse")}
                </LinkUi>
              </DrawerBody>
              <Divider />
              <DrawerBody as={Flex} direction="column" fontSize="18">
                <LinkUi as={Link} to="/estate/new">
                  {t("sell")}
                </LinkUi>
              </DrawerBody>
              <Divider />
              <DrawerBody>
                <Flex gap={2}>
                  <ThemeSwitchButton />
                  <LanguageSelect />
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Container>
    </Box>
  );
};
