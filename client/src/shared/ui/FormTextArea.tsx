import { Textarea } from "@chakra-ui/react";
import { useFormikContext } from "formik";

interface Props {
  placeholder: string;
  name: string;
  disabled?: boolean;
  autoComplete?: string;
}

export const FormTextArea: React.FC<Props> = (props) => {
  const { values, setFieldValue } = useFormikContext<any>();
  return (
    <Textarea
      resize="none"
      rows={5}
      value={values[props.name]}
      onChange={(e) => setFieldValue(props.name, e.target.value)}
      {...props}
    />
  );
};
