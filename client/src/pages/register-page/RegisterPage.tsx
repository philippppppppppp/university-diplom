import { Text } from "@chakra-ui/react";
import { MinimalLayout } from "../../shared/ui";
import { RedirectLink, useRedirect } from "../../shared/redirect";
import { RegisterForm } from "../../features/auth";
import { useTranslation } from "../../shared/translations";

export const RegisterPage: React.FC = () => {
  const redirect = useRedirect();
  const { t } = useTranslation();

  return (
    <MinimalLayout>
      <RegisterForm onRegisterSuccess={redirect} />
      <Text
        textDecor="underline"
        fontSize="14"
        alignSelf="center"
        as={RedirectLink}
        to="/login"
        forward
      >
        {t("login")}
      </Text>
    </MinimalLayout>
  );
};
