import { Input } from "@chakra-ui/react";
import { Field } from "formik";

interface Props {
  placeholder: string;
  type?: "email" | "text" | "number";
  name: string;
  disabled?: boolean;
  autoComplete?: string;
}

export const FormInput: React.FC<Props> = (props) => (
  <Input as={Field} {...props} />
);
