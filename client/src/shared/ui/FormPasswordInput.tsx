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
  abilityToShow?: boolean;
  placeholder: string;
  name: string;
  disabled?: boolean;
  autoComplete?: string;
}

export const FormPasswordInput: FC<Props> = ({
  onClick,
  abilityToShow,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const switchShowPassword = () => setShowPassword((v) => !v);

  if (abilityToShow) {
    return (
      <InputGroup onClick={onClick}>
        <Input
          type={showPassword ? "text" : "password"}
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
  }

  return <Input type={"password"} as={Field} {...props} />;
};
