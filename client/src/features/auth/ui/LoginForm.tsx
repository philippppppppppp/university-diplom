import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "../../../shared/translations";
import { Link } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import { useAuth, Credentials } from "../../../shared/auth";
import { object, string } from "yup";
import { FormInput, FormPasswordInput } from "../../../shared/ui";
import { FormError } from "../../../shared/ui/FormError";

const initialValues: Credentials = {
  email: "",
  password: "",
};

const minPasswordLength = +(process.env.REACT_APP_MIN_PASSWORD_LENGTH ?? 6);
const maxPasswordLength = +(process.env.REACT_APP_MAX_PASSWORD_LENGTH ?? 20);

interface Props {
  onSubmit?(): void;
  onLoginSuccess?(): void;
}

export const LoginForm: React.FC<Props> = ({ onSubmit, onLoginSuccess }) => {
  const { login, loading } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (
    credentials: Credentials,
    { setErrors }: FormikHelpers<Credentials>
  ) => {
    try {
      await login(credentials);
      onLoginSuccess && onLoginSuccess();
    } catch (err: any) {
      setErrors({
        email: err.message,
        password: err.message,
      });
    } finally {
      onSubmit && onSubmit();
    }
  };

  const passwordLengthTranslationObject = {
    key: "passwordLength",
    interpolations: {
      min: minPasswordLength,
      max: maxPasswordLength,
    },
  };

  const credentialsSchema = object({
    email: string().email("invalidEmail").required("loginRequiredFields"),
    password: string()
      .min(minPasswordLength, passwordLengthTranslationObject)
      .max(maxPasswordLength, passwordLengthTranslationObject)
      .required("loginRequiredFields"),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={credentialsSchema}
    >
      <Form>
        <Flex direction="column" gap="2">
          <FormInput
            placeholder={t("email")}
            type="email"
            name="email"
            disabled={loading}
          />
          <FormPasswordInput
            placeholder={t("password")}
            name="password"
            disabled={loading}
          />
          <FormError />
          <Button type="submit" isLoading={loading}>
            {t("login")}
          </Button>
          <Text
            textDecor="underline"
            fontSize="14"
            alignSelf="center"
            as={Link}
            to="/register"
          >
            {t("register")}
          </Text>
        </Flex>
      </Form>
    </Formik>
  );
};
