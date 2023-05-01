import { FC, useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../shared/auth";
import { Spinner } from "@chakra-ui/react";
import { useTranslation } from "../../shared/translations";
import { MinimalLayout } from "../../shared/ui";

export const ActivationPage: FC = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState(false);
  const { token } = useParams<{ token: "string" }>();
  const { activate, loading } = useAuth();

  const handleActivate = useCallback(async () => {
    try {
      await activate(token!);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message);
    }
  }, [activate, token]);

  useEffect(() => {
    handleActivate();
  }, [handleActivate]);

  return (
    <MinimalLayout>
      {loading && <Spinner />}
      {!!error && t(error)}
      {success && t("activationSuccess")}
    </MinimalLayout>
  );
};
