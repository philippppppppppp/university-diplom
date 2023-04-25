import { useState, FC, useRef } from "react";
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "../../shared/translations";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useAuth, Credentials } from "../../shared/auth";

const initialValues: Credentials = {
  email: "",
  password: "",
};

export const AuthButton: FC = () => {
  const { authenticated, login, logout, loading } = useAuth();
  const { t } = useTranslation();

  const ref = useRef<HTMLFormElement>(null);

  const [error, setError] = useState<null | string>(null);
  const clearError = () => setError(null);

  const [showPassword, setShowPassword] = useState(false);
  const switchShowPassword = () => setShowPassword((v) => !v);

  const handleSubmit = async (credentials: Credentials) => {
    try {
      await login(credentials);
    } catch (err: any) {
      setError(t(err.message));
    } finally {
      ref.current?.focus();
    }
  };

  if (authenticated) {
    return <Button onClick={logout}>{t("logout")}</Button>;
  }

  return (
    <Popover onClose={clearError}>
      <PopoverTrigger>
        <Button>{t("login")}</Button>
      </PopoverTrigger>
      <PopoverContent ref={ref}>
        <PopoverArrow />
        <PopoverHeader fontWeight="700" textAlign="center">
          {t("login")}
        </PopoverHeader>
        <PopoverBody>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              <Flex direction="column" gap="2">
                <div onClick={clearError}>
                  <Input
                    placeholder={t("email")}
                    type="email"
                    name="email"
                    as={Field}
                    disabled={loading}
                  />
                </div>
                <div onClick={clearError}>
                  <InputGroup>
                    <Input
                      placeholder={t("password")}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="on"
                      as={Field}
                      disabled={loading}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Show/hide password"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={switchShowPassword}
                      />
                    </InputRightElement>
                  </InputGroup>
                </div>
                <Text align="center" color="red">
                  {error}
                </Text>
                <Button type="submit" isLoading={loading}>
                  {t("login")}
                </Button>
                <Text
                  textDecor="underline"
                  fontSize="14"
                  alignSelf="center"
                  as={Link}
                  to="/register"
                >
                  {t("register")}
                </Text>
              </Flex>
            </Form>
          </Formik>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
