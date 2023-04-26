import { Box, Flex } from "@chakra-ui/react";
import { LoginForm } from "../../features/auth/ui/LoginForm";
import { MinimalHeader } from "../../widgets/header";
import { useRedirect } from "../../shared/redirect";

export const LoginPage: React.FC = () => {
  const redirect = useRedirect();

  return (
    <>
      <Box position="absolute" left="0" right="0" top="0">
        <MinimalHeader />
      </Box>
      <Flex w="100%" h="100vh" alignItems="center" justifyContent="center">
        <Box borderWidth="1px" borderRadius="md" p="4">
          <LoginForm onLoginSuccess={redirect} />
        </Box>
      </Flex>
    </>
  );
};
