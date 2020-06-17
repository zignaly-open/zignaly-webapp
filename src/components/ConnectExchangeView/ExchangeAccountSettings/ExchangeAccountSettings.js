import React, { useEffect, useContext } from "react";
import { Box, Switch, FormControlLabel } from "@material-ui/core";
import ModalPathContext from "../ModalPathContext";
import { FormattedMessage, useIntl } from "react-intl";
import CustomButton from "../../CustomButton";
import CustomTooltip from "../../CustomTooltip";
import { Help } from "@material-ui/icons";
import ExchangeAccountForm from "../ExchangeAccountForm";

/**
 * @typedef {Object} DefaultProps
 * @property {string} internalId Internal Exchange id.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountSettings = ({ internalId }) => {
  const {
    pathParams: { selectedAccount },
    setTitle,
  } = useContext(ModalPathContext);
  const intl = useIntl();

  useEffect(() => {
    setTitle(<FormattedMessage id="accounts.settings" />);
  }, []);
  console.log(selectedAccount);

  return (
    <form className="exchangeAccountSettings">
      <ExchangeAccountForm>
        <FormControlLabel
          control={<Switch onChange={() => {}} size="small" />}
          label={<FormattedMessage id="accounts.options.maxconcurrent" />}
          labelPlacement="start"
        />
        <CustomTooltip title={intl.formatMessage({ id: "terminal.stoploss.help" })}>
          <Help />
        </CustomTooltip>
        <FormControlLabel
          control={<Switch onChange={() => {}} size="small" />}
          label={<FormattedMessage id="accounts.options.minvolume" />}
          labelPlacement="start"
        />
        <CustomButton className="body2 text-default" onClick={() => {}}>
          <FormattedMessage id="accounts.delete" />
        </CustomButton>
      </ExchangeAccountForm>
    </form>
  );
};

export default ExchangeAccountSettings;
