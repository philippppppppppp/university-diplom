import { ChangeEvent, FC } from "react";
import { Input } from "@chakra-ui/react";
import { useFormikContext } from "formik";

interface Props {
  name: string;
}

export const FormImageSelect: FC<Props> = ({ name }) => {
  const { setFieldValue, isSubmitting, values } = useFormikContext<any>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(
      name,
      e.target.value.split(",").map((v) => v.trim())
    );
  };

  return (
    <Input
      name={name}
      onChange={handleChange}
      disabled={isSubmitting}
      value={values[name].join(", ")}
      placeholder="temporary image select field"
    />
  );
};
