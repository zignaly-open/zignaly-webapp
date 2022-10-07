import React from "react";
import "./signup.scss";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import SignupForm from "../../components/Forms/SignupForm";
import useRedirectUponSessionValid from "../../hooks/useRedirectUponSessionValid";
import Login from "../../components/Login/Login";
import useHasMounted from "hooks/useHasMounted";
import { Box } from "@material-ui/core";


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
        <Box className="loginTabs">
          <SignupForm />
        </Box>
      </Login>
    </>
  );
};

export default SignupPage;
