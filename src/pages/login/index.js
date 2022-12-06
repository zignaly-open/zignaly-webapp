import React from "react";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import LoginForm from "../../components/Forms/LoginForm";
import Login from "../../components/Login/Login";
import useRedirectUponSessionValid from "hooks/useRedirectUponSessionValid";
import useHasMounted from "hooks/useHasMounted";
import LoginOld from "components/Login/LoginOld";
import LoginTabsOld from "components/Login/LoginTabsOld";

const LoginPage = () => {
  const intl = useIntl();
  useRedirectUponSessionValid();

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
            id: "login.title",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Login>
        <LoginTabs>
          <LoginForm />
        </LoginTabs>
      </Login>
    </>
  );
};

export default LoginPage;
