import { FormikHelpers } from "formik";
import {
  EstateFormValues,
  transformEstateItemInfoToFormValues,
  useEstate,
  useUpdateEstate,
} from "../hooks";
import { Form } from "./components/Form";

interface Props {
  id: string;
  onSuccess?(): void;
  onCancel?(): void;
}

export const UpdateEstateForm: React.FC<Props> = ({
  id,
  onSuccess,
  onCancel,
}) => {
  const { data, isSuccess } = useEstate(id);
  const { mutate } = useUpdateEstate();

  if (!isSuccess) {
    return null;
  }

  const values = transformEstateItemInfoToFormValues(data);

  const handleSubmit = (
    values: EstateFormValues,
    { setSubmitting }: FormikHelpers<EstateFormValues>
  ) => {
    mutate(
      { ...values, id },
      {
        onSuccess() {
          setSubmitting(false);
          !!onSuccess && onSuccess();
        },
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit} initialValues={values} onCancel={onCancel} />
  );
};
