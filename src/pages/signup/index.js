import React from "react";
import "./signup.scss";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import SignupForm from "../../components/Forms/SignupForm";
import useRedirectUponSessionValid from "../../hooks/useRedirectUponSessionValid";
import Login from "../../components/Login/Login";
import useHasMounted from "hooks/useHasMounted";

const SignupPage = () => {
  const intl = useIntl();
  useRedirectUponSessionValid("/profitSharing");

  const hasMounted = useHasMounted();
  if (!hasMounted) {
    // Don't render statically due to split test
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "action.signup",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Login>
        <LoginTabs>
          <SignupForm />
        </LoginTabs>
      </Login>
    </>
  );
};

export default SignupPage;
