import { FC, useRef } from "react";
import {
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
} from "@chakra-ui/react";
import { useTranslation } from "../../../shared/translations";
import { useAuth } from "../../../shared/auth";
import { LoginForm } from "./LoginForm";
import { RedirectLink } from "../../../shared/redirect";
import { Link } from "react-router-dom";
import { useViewer } from "../../../entities/viewer";

interface Props {
  withPopUp?: boolean;
}

export const AuthButton: FC<Props> = ({ withPopUp }) => {
  const { authenticated, logout } = useAuth();
  const { t } = useTranslation();
  const { data: user } = useViewer();

  const ref = useRef<HTMLFormElement>(null);
  const restoreFocus = () => ref.current?.focus();

  if (authenticated) {
    return (
      <Menu>
        <MenuButton as={Button}>{user?.name}</MenuButton>
        <MenuList>
          <MenuItem as={Link} to="/estate/my">
            {t("myAds")}
          </MenuItem>
          <MenuItem as={Link} to="/estate/favorites">
            {t("favorites")}
          </MenuItem>

          <MenuItem as={Link} to="/settings">
            {t("settings")}
          </MenuItem>
          <Divider />
          <MenuItem onClick={logout}>{t("logout")}</MenuItem>
        </MenuList>
      </Menu>
    );
  }

  if (withPopUp) {
    return (
      <Popover>
        <PopoverTrigger>
          <Button>{t("login")}</Button>
        </PopoverTrigger>
        <PopoverContent ref={ref}>
          <PopoverArrow />
          <PopoverHeader fontWeight="700" textAlign="center">
            {t("login")}
          </PopoverHeader>
          <PopoverBody as={Flex} direction="column" gap="2">
            <LoginForm onSubmit={restoreFocus} />
            <Text
              textDecor="underline"
              fontSize="14"
              as={RedirectLink}
              to="/register"
              alignSelf="center"
            >
              {t("register")}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Button as={RedirectLink} to="/login">
      {t("login")}
    </Button>
  );
};
