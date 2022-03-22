import React from "react";
import { VerifiedUser } from "@mui/icons-material";
import "./VerifiedIcon.scss";
import { useIntl } from "react-intl";

const VerifiedIcon = () => {
  const intl = useIntl();
  return (
    <VerifiedUser
      className="verifiedIcon"
      titleAccess={intl.formatMessage({ id: "srv.verified" })}
    />
  );
};

export default VerifiedIcon;
