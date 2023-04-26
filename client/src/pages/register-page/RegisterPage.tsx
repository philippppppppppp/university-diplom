import { Box, Flex, Text } from "@chakra-ui/react";
import { MinimalHeader } from "../../widgets/header";
import { RedirectLink, useRedirect } from "../../shared/redirect";
import { RegisterForm } from "../../features/auth";
import { useTranslation } from "../../shared/translations";

export const RegisterPage: React.FC = () => {
  const redirect = useRedirect();
  const { t } = useTranslation();

  return (
    <>
      <Box position="absolute" left="0" right="0" top="0">
        <MinimalHeader />
      </Box>
      <Flex w="100%" h="100vh" alignItems="center" justifyContent="center">
        <Flex
          borderWidth="1px"
          borderRadius="md"
          p="4"
          direction="column"
          gap="2"
        >
          <RegisterForm onRegisterSuccess={redirect} />
          <Text
            textDecor="underline"
            fontSize="14"
            alignSelf="center"
            as={RedirectLink}
            to="/login"
            forward
          >
            {t("login")}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};
