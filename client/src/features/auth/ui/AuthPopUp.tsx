import { FC, useRef } from "react";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useTranslation } from "../../../shared/translations";
import { useAuth } from "../../../shared/auth";
import { LoginForm } from "./LoginForm";

export const AuthPopUp: FC = () => {
  const { authenticated, logout } = useAuth();
  const { t } = useTranslation();

  const ref = useRef<HTMLFormElement>(null);
  const restoreFocus = () => ref.current?.focus();

  if (authenticated) {
    return <Button onClick={logout}>{t("logout")}</Button>;
  }

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
        <PopoverBody>
          <LoginForm onSubmit={restoreFocus} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
