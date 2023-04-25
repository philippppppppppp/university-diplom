import { useState, FC } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Field } from "formik";

interface Props {
  onClick?: () => void;
  placeholder: string;
  name: string;
  disabled?: boolean;
}

export const FormPasswordInput: FC<Props> = ({ onClick, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const switchShowPassword = () => setShowPassword((v) => !v);

  return (
    <InputGroup onClick={onClick}>
      <Input
        type={showPassword ? "text" : "password"}
        autoComplete="on"
        as={Field}
        {...props}
      />
      <InputRightElement>
        <IconButton
          aria-label="Show/hide password"
          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
          onClick={switchShowPassword}
        />
      </InputRightElement>
    </InputGroup>
  );
};
