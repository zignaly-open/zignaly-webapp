import React, { useState } from "react";
import "./CloneProviderButton.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { navigate } from "gatsby";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../../store/actions/ui";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const CloneProviderButton = ({ provider }) => {
  const storeSession = useStoreSessionSelector();
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  /**
   *  Function to redirect to cloned provider's profile.
   *
   * @param {String} id Id of the cloned provider.
   * @returns {void} None.
   */
  const redirect = (id) => {
    if (provider.isCopyTrading) {
      navigate(`/copyTraders/${id}`);
    } else {
      navigate(`/signalProviders/${id}`);
    }
  };

  const cloneProvider = async () => {
    try {
      setLoader(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
      };
      const response = await tradeApi.cloneProvider(payload);
      if (response) {
        setLoader(false);
        redirect(response.providerId);
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };

  return (
    <Box
      alignItems="center"
      className="cloneTraderButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <CustomButton className="submitButton" loading={loader} onClick={cloneProvider}>
        {provider.isCopyTrading ? (
          <FormattedMessage id="srv.clonetrader" />
        ) : (
          <FormattedMessage id="srv.cloneprovider" />
        )}
      </CustomButton>
    </Box>
  );
};

export default CloneProviderButton;
