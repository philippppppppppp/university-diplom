import { forwardRef } from "@chakra-ui/react";
import {
  useLocation,
  useNavigate,
  Link,
  LinkProps,
  Navigate,
} from "react-router-dom";

const redirectKey = "from";

export const useRedirect = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const redirectTo = state?.[redirectKey] ?? "/";

  const redirect = () => {
    navigate(redirectTo);
  };

  return redirect;
};

type RedirectLinkProps = Omit<LinkProps, "state"> & { forward?: boolean };

export const RedirectLink: React.FC<RedirectLinkProps> = forwardRef(
  ({ forward, ...props }, ref) => {
    const { pathname, state } = useLocation();
    const redirectToForward = state?.[redirectKey];
    return (
      <Link
        {...props}
        state={{ [redirectKey]: forward ? redirectToForward : pathname }}
        ref={ref}
      />
    );
  }
);

interface NavigateWithRedirectProps {
  to: string;
}

export const NavigateWithRedirect: React.FC<NavigateWithRedirectProps> = ({
  to,
}) => {
  const { pathname } = useLocation();
  return <Navigate to={to} state={{ [redirectKey]: pathname }} />;
};
