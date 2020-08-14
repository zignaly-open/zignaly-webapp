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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const redirect = () => {
    if (provider.isCopyTrading) {
      navigate("/copyTraders");
    } else {
      navigate("/signalProviders");
    }
  };

  const deleteClone = async () => {
    try {
      setLoading(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
      };
      const response = await tradeApi.providerDelete(payload);
      if (response) {
        setLoading(false);
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
      <CustomButton className="deleteButton" loading={loading} onClick={deleteClone}>
        <FormattedMessage id="srv.deletetrader" />
      </CustomButton>
    </Box>
  );
};

export default CloneDeleteButton;
