import { Input } from "@chakra-ui/react";
import { Field } from "formik";
import { useTranslation } from "../translations";

interface Props {
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export const FormPhoneInput: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  return <Input as={Field} name="phone" placeholder={t("phone")} {...props} />;
};
