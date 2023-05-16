import { Flex } from "@chakra-ui/react";
import { useTranslation } from "../translations";

interface Props {
  message?: string;
}

export const LoadingError: React.FC<Props> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <Flex h="100" justifyContent="center" alignItems="center">
      {message ?? t("genericError")}
    </Flex>
  );
};
