import { Input } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { ChangeEvent } from "react";

interface Props {
  placeholder: string;
  type?: "email" | "text" | "number";
  name: string;
  autoComplete?: string;
}

export const FormInput: React.FC<Props> = (props) => {
  const { values, setFieldValue, isSubmitting } = useFormikContext<any>();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFieldValue(props.name, value);
  };
  return (
    <Input
      value={values[props.name]}
      onChange={handleChange}
      disabled={isSubmitting}
      {...props}
    />
  );
};
