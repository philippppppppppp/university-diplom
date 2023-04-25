import { useFormikContext } from "formik";
import { Text } from "@chakra-ui/react";
import { useTranslation } from "../translations";

export const FormError: React.FC = () => {
  const { t } = useTranslation();
  const { errors, touched } = useFormikContext<{ [key: string]: string }>();
  const error = Object.entries(errors).find(
    ([key, value]) => !!value && touched[key]
  )?.[1];

  if (!error) return null;

  return (
    <Text align="center" color="red">
      {t(error)}
    </Text>
  );
};
