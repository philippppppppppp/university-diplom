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

type Props = Omit<LinkProps, "state">;

export const RedirectLink: React.FC<Props> = forwardRef((props, ref) => {
  const { pathname } = useLocation();
  return <Link {...props} state={{ [redirectKey]: pathname }} ref={ref} />;
});
