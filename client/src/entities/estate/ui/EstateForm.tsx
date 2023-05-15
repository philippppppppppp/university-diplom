import { Box, Flex } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import {
  FormImageSelect,
  FormInput,
  FormSelect,
  FormSubmit,
  FormTextArea,
} from "../../../shared/ui";
import { CreateEstate, useCreateEstate } from "../hooks";
import { useTranslation } from "../../../shared/translations";
import { array, object, string } from "yup";
import { FormError } from "../../../shared/ui/FormError";
import { useNavigate } from "react-router-dom";

const initialValues: CreateEstate = {
  type: "",
  title: "",
  address: "",
  priceUAH: "",
  rooms: "",
  livingAreaM2: "",
  kitchenAreaM2: "",
  description: "",
  images: [],
};

const validationSchema = object({
  type: string().required("createEstateRequiredFields"),
  title: string().required("createEstateRequiredFields"),
  address: string().required("createEstateRequiredFields"),
  priceUAH: string().required("createEstateRequiredFields"),
  rooms: string().required("createEstateRequiredFields"),
  livingAreaM2: string().required("createEstateRequiredFields"),
  kitchenAreaM2: string().required("createEstateRequiredFields"),
  description: string(),
  images: array().of(string()),
});

export const EstateForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate } = useCreateEstate();

  const handleSubmit = (
    values: CreateEstate,
    { setSubmitting }: FormikHelpers<CreateEstate>
  ) => {
    mutate(values, {
      onSuccess({ id }) {
        setSubmitting(false);
        navigate(`/estate/${id}`);
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <Flex gap="4" direction="column">
          <Box maxW="200px" w="100%">
            <FormSelect name="type" placeholder={t("type")}>
              <option value="flat">{t("flat")}</option>
              <option value="house">{t("house")}</option>
            </FormSelect>
          </Box>
          <Box maxW="450px" w="100%">
            <FormInput name="title" placeholder={t("title")} />
          </Box>
          <Box maxW="450px" w="100%">
            <FormInput name="address" placeholder={t("address")} />
          </Box>
          <Flex gap="4" wrap="wrap">
            <Box flex="1 1 200px">
              <FormInput
                name="priceUAH"
                placeholder={t("priceUAH")}
                type="number"
              />
            </Box>
            <Box flex="1 1 200px">
              <FormSelect name="rooms" placeholder={t("rooms")}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </FormSelect>
            </Box>
            <Box flex="1 1 200px">
              <FormInput
                name="livingAreaM2"
                placeholder={t("livingAreaM2")}
                type="number"
              />
            </Box>
            <Box flex="1 1 200px">
              <FormInput
                name="kitchenAreaM2"
                placeholder={t("kitchenAreaM2")}
                type="number"
              />
            </Box>
          </Flex>
          <FormTextArea name="description" placeholder={t("description")} />
          <FormImageSelect name="images" />
          <FormError />
          <Box alignSelf="flex-start" w="150px">
            <FormSubmit>{t("save")}</FormSubmit>
          </Box>
        </Flex>
      </Form>
    </Formik>
  );
};
