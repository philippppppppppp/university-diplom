import { Text } from "@chakra-ui/react";
import { LoginForm } from "../../features/auth";
import { MinimalLayout } from "../../shared/ui";
import { RedirectLink, useRedirect } from "../../shared/redirect";
import { useTranslation } from "../../shared/translations";

export const LoginPage: React.FC = () => {
  const redirect = useRedirect();
  const { t } = useTranslation();

  return (
    <MinimalLayout>
      <LoginForm onLoginSuccess={redirect} />
      <Text
        textDecor="underline"
        fontSize="14"
        as={RedirectLink}
        to="/register"
        alignSelf="center"
        forward
      >
        {t("register")}
      </Text>
    </MinimalLayout>
  );
};
