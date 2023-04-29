import { FC, useState } from "react";
import { Text } from "@chakra-ui/react";
import { MinimalLayout } from "../../shared/ui";
import { RedirectLink } from "../../shared/redirect";
import { RegisterForm } from "../../features/auth";
import { useTranslation } from "../../shared/translations";

export const RegisterPage: FC = () => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => setSuccess(true);

  return (
    <MinimalLayout>
      {success ? (
        t("activateAccount")
      ) : (
        <>
          <RegisterForm onRegisterSuccess={handleSuccess} />
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
        </>
      )}
    </MinimalLayout>
  );
};
