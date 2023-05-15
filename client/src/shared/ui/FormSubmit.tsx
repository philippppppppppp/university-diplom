import { Button } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { PropsWithChildren, FC } from "react";

export const FormSubmit: FC<PropsWithChildren> = ({ children }) => {
  const { isSubmitting } = useFormikContext<any>();
  return (
    <Button type="submit" isLoading={isSubmitting}>
      {children}
    </Button>
  );
};
