import React, { useState } from "react";
import "./CloneDeleteButton.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { navigate } from "gatsby";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../../store/actions/ui";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Delete button component for clones.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const CloneDeleteButton = ({ provider }) => {
  const storeSession = useStoreSessionSelector();
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const redirect = () => {
    if (provider.isCopyTrading) {
      navigate(`/copyTraders/browse`);
    } else {
      navigate(`/signalProviders/browse`);
    }
  };

  const deleteClone = async () => {
    try {
      setLoader(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
      };
      const response = await tradeApi.providerDelete(payload);
      if (response) {
        setLoader(false);
        dispatch(
          showSuccessAlert("srv.deleteprovider.alert.title", "srv.deleteprovider.alert.body"),
        );
        redirect();
      }
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };

  return (
    <Box
      alignItems="center"
      className="cloneDeleteButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <CustomButton className="deleteButton" loading={loader} onClick={deleteClone}>
        {provider.isCopyTrading ? (
          <FormattedMessage id="srv.deletetrader" />
        ) : (
          <FormattedMessage id="srv.deleteprovider" />
        )}
      </CustomButton>
    </Box>
  );
};

export default CloneDeleteButton;
