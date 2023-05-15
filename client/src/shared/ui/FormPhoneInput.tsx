import { Input } from "@chakra-ui/react";
import { Field, useFormikContext } from "formik";
import { useTranslation } from "../translations";

interface Props {
  placeholder?: string;
  name?: string;
  autoComplete?: string;
}

export const FormPhoneInput: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext<any>();
  return (
    <Input
      as={Field}
      name="phone"
      disabled={isSubmitting}
      placeholder={t("phone")}
      {...props}
    />
  );
};
