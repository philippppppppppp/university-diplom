import { FC, PropsWithChildren } from "react";
import { Select } from "@chakra-ui/react";
import { useFormikContext } from "formik";

interface Props {
  name: string;
  placeholder: string;
  autocomplete?: string;
  disables?: boolean;
}

export const FormSelect: FC<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => {
  const { values, setFieldValue, isSubmitting } = useFormikContext<any>();
  return (
    <Select
      value={values[props.name]}
      onChange={(e) => setFieldValue(props.name, e.target.value)}
      disabled={isSubmitting}
      {...props}
    >
      {children}
    </Select>
  );
};
