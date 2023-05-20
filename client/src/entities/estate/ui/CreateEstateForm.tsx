import { FormikHelpers } from "formik";
import { useCreateEstate } from "../hooks";
import type { EstateFormValues } from "../types";
import { Form } from "./components/Form";

interface Props {
  onSuccess?(id: string): void;
}

export const CreateEstateForm: React.FC<Props> = ({ onSuccess }) => {
  const { mutate } = useCreateEstate();

  const handleSubmit = (
    values: EstateFormValues,
    { setSubmitting }: FormikHelpers<EstateFormValues>
  ) => {
    mutate(values, {
      onSuccess({ id }) {
        setSubmitting(false);
        !!onSuccess && onSuccess(id);
      },
    });
  };

  return <Form onSubmit={handleSubmit} />;
};
