import { Input } from "@chakra-ui/react";
import { Field } from "formik";

interface Props {
  onClick?: () => void;
  placeholder: string;
  type?: "email" | "text";
  name: string;
  disabled?: boolean;
}

export const FormInput: React.FC<Props> = ({ onClick, ...props }) => (
  <div onClick={onClick}>
    <Input as={Field} {...props} />
  </div>
);
