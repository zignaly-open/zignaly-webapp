import React, { useEffect, useRef } from "react";
import "./signup.scss";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import SignupForm from "../../components/Forms/SignupForm/SignupForm";
import SignupFormB from "../../components/Forms/SignupForm/SignupFormB";
import useRedirectUponSessionValid from "../../hooks/useRedirectUponSessionValid";
import Login from "../../components/Login/Login";
import useHasMounted from "hooks/useHasMounted";
import useABTest from "hooks/useABTest";
import LoginOld from "components/Login/LoginOld";

const SignupPage = () => {
  const intl = useIntl();
  useRedirectUponSessionValid("/profitSharing");

  const showNew = useABTest();
  useEffect(() => {
    if (showNew !== null) {
      window.location.hash = `v=${showNew ? 2 : 1}`;
    }
  }, []);

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
      {showNew || showNew === null ? (
        <Login>
          <SignupFormB />
        </Login>
      ) : (
        <LoginOld>
          <SignupForm />
        </LoginOld>
      )}
    </>
  );
};

export default SignupPage;
