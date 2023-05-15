import { useState, FC } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Field, useFormikContext } from "formik";

interface Props {
  onClick?: () => void;
  abilityToShow?: boolean;
  placeholder: string;
  name: string;
  autoComplete?: string;
}

export const FormPasswordInput: FC<Props> = ({
  onClick,
  abilityToShow,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const switchShowPassword = () => setShowPassword((v) => !v);
  const { isSubmitting } = useFormikContext();

  if (abilityToShow) {
    return (
      <InputGroup onClick={onClick}>
        <Input
          type={showPassword ? "text" : "password"}
          as={Field}
          disabled={isSubmitting}
          {...props}
        />
        <InputRightElement>
          <IconButton
            aria-label="Show/hide password"
            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
            onClick={switchShowPassword}
            tabIndex={-1}
          />
        </InputRightElement>
      </InputGroup>
    );
  }

  return <Input type={"password"} as={Field} {...props} />;
};
