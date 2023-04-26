import { forwardRef } from "@chakra-ui/react";
import { useLocation, useNavigate, Link, LinkProps } from "react-router-dom";

const redirectKey = "from";

export const useRedirect = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const redirectTo = state?.[redirectKey] ?? "/";

  const redirect = () => {
    navigate(redirectTo ?? "/");
  };

  return redirect;
};

type Props = Omit<LinkProps, "state"> & { forward?: boolean };

export const RedirectLink: React.FC<Props> = forwardRef(
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
