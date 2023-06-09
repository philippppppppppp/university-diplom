import { Flex } from "@chakra-ui/react";
import { useTranslation } from "../../../shared/translations";
import { Formik, Form, FormikHelpers } from "formik";
import { useAuth, RegisterData } from "../../../shared/auth";
import { object, string } from "yup";
import {
  FormInput,
  FormPasswordInput,
  FormPhoneInput,
  FormSubmit,
} from "../../../shared/ui";
import { FormError } from "../../../shared/ui/FormError";

type RegisterValues = RegisterData & { confirmPassword: string };

const initialValues: RegisterValues = {
  email: "",
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const minPasswordLength = +(process.env.REACT_APP_MIN_PASSWORD_LENGTH ?? 6);
const maxPasswordLength = +(process.env.REACT_APP_MAX_PASSWORD_LENGTH ?? 20);
const minNameLength = +(process.env.REACT_APP_MIN_NAME_LENGTH ?? 2);
const maxNameLength = +(process.env.REACT_APP_MAX_NAME_LENGTH ?? 30);

const passwordLengthTranslationObject = {
  key: "passwordLength",
  interpolations: {
    min: minPasswordLength,
    max: maxPasswordLength,
  },
};

const nameLengthTranslationObject = {
  key: "nameLength",
  interpolations: {
    min: minNameLength,
    max: maxNameLength,
  },
};

const credentialsSchema = object({
  email: string().email("invalidEmail").required("registerRequiredFields"),
  name: string()
    .min(minNameLength, nameLengthTranslationObject)
    .max(maxNameLength, nameLengthTranslationObject)
    .required("registerRequiredFields"),
  phone: string().length(10, "phoneLength").required("registerRequiredFields"),
  password: string()
    .min(minPasswordLength, passwordLengthTranslationObject)
    .max(maxPasswordLength, passwordLengthTranslationObject)
    .required("registerRequiredFields"),
  confirmPassword: string()
    .min(minPasswordLength, passwordLengthTranslationObject)
    .max(maxPasswordLength, passwordLengthTranslationObject)
    .test("passwords match", "passwordsMatch", function (value) {
      return this.parent.password === value;
    })
    .required("registerRequiredFields"),
});

interface Props {
  onSubmit?(): void;
  onRegisterSuccess?(): void;
}

export const RegisterForm: React.FC<Props> = ({
  onSubmit,
  onRegisterSuccess,
}) => {
  const { register } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (
    { confirmPassword, ...registerValues }: RegisterValues,
    { setErrors, setSubmitting }: FormikHelpers<RegisterValues>
  ) => {
    try {
      await register(registerValues);
      setSubmitting(false);
      onRegisterSuccess && onRegisterSuccess();
    } catch (err: any) {
      setErrors({
        email: err.message,
      });
    } finally {
      onSubmit && onSubmit();
    }
  };

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
            autoComplete="email"
          />
          <FormInput placeholder={t("name")} name="name" autoComplete="name" />
          <FormPhoneInput autoComplete="phone" />
          <FormPasswordInput
            placeholder={t("password")}
            name="password"
            abilityToShow
            autoComplete="new-password"
          />
          <FormPasswordInput
            placeholder={t("confirmPassword")}
            name="confirmPassword"
            autoComplete="new-password"
          />
          <FormError />
          <FormSubmit>{t("register")}</FormSubmit>
        </Flex>
      </Form>
    </Formik>
  );
};
