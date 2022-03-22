import React from "react";
import { Box } from "@mui/material";
import "./NoDemoAccount.scss";
import { FormattedMessage } from "react-intl";
// import CustomButton from "../../../CustomButton";
import { Typography } from "@mui/material";
// import ModalPathContext from "../../ModalPathContext";
import useExchangeList from "../../../../hooks/useExchangeList";
import { getExchangeNamesCombined } from "../../../../utils/helpers";

/**
 * Displays buttons to create demo exchange account.
 * @returns {JSX.Element} Component JSX.
 */
const NoDemoAccount = () => {
  const { exchanges } = useExchangeList();
  // const { navigateToPath } = useContext(ModalPathContext);

  return (
    <Box className="noDemoAccount">
      <Box alignItems="center" display="flex" flexDirection="column">
        {/* <Typography className="connectHead" variant="h3">
          <FormattedMessage id="accounts.connect.experiment" />
        </Typography>
        <CustomButton
          className="body2 textPurple borderPurple exchangeButton"
          onClick={() => navigateToPath("createDemoAccount")}
        >
          <FormattedMessage id="accounts.create.demo" />
        </CustomButton> */}
        <Typography variant="h4">
          <FormattedMessage id="accounts.connect.existing.or" />
        </Typography>
        <Typography className="body1 connectDesc" variant="h4">
          <FormattedMessage
            id="accounts.connect.first"
            values={{ exchanges: getExchangeNamesCombined(exchanges, "or") }}
          />
        </Typography>
      </Box>
    </Box>
  );
};

export default NoDemoAccount;
