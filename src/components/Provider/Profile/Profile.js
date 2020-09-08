import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { Box } from "@material-ui/core";
import AboutUs from "../../../components/Provider/Profile/AboutUs";
import Strategy from "../../../components/Provider/Profile/Strategy";
import WhoWeAre from "../../../components/Provider/Profile/WhoWeAre";
import Performance from "../../../components/Provider/Profile/Performance";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import CloneProviderButton from "../../../components/Provider/ProviderHeader/CloneProviderButton";
import CloneDeleteButton from "../../../components/Provider/ProviderHeader/ProviderDeleteButton";
import Modal from "../../../components/Modal";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import Options from "../../../components/Provider/Profile/Options";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const Profile = ({ provider }) => {
  const storeSettings = useStoreSettingsSelector();
  const intl = useIntl();
  const [paymentModal, showPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const checkPaymentStatus = () => {
    if (typeof window !== "undefined") {
      let url = window.location.href;
      if (url.includes("error")) {
        setPaymentStatus("error");
        showPaymentModal(true);
        // history.pushState({}, "error", url.split("#")[0]);
      }
      if (url.includes("success")) {
        setPaymentStatus("success");
        showPaymentModal(true);
        // history.pushState({}, "success", url.split("#")[0]);
      }
    }
  };

  useEffect(checkPaymentStatus, []);

  const checkAvailableOptions = () => {
    let options = { ...provider.options };
    let available = false;
    delete options.allowClones;
    const optionValues = Object.values(options);
    optionValues.forEach((item) => {
      if (item) {
        available = true;
      }
    });
    return available;
  };

  return (
    <Box
      alignItems="flex-start"
      className="profile"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="center"
    >
      <Helmet>
        <title>
          {`${provider.name} - ${intl.formatMessage({
            id: "srv.profile",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Modal onClose={() => showPaymentModal(false)} size="small" state={paymentModal}>
        <h1>Murad Malik</h1>
      </Modal>
      <Box className="leftColumn">
        <Box bgcolor="grid.content" className="aboutBox">
          <AboutUs provider={provider} />
        </Box>
        <Box bgcolor="grid.content" className="strategyBox">
          <Strategy provider={provider} />
        </Box>
      </Box>
      <Box className="rightColumn">
        <Box bgcolor="grid.content" className="whoWeAreBox">
          <WhoWeAre provider={provider} />
        </Box>
        <Box bgcolor="grid.content" className="performanceBox">
          <Performance provider={provider} />
        </Box>
      </Box>
      {!provider.isCopyTrading &&
        !provider.disable &&
        provider.exchangeInternalId === storeSettings.selectedExchange.internalId &&
        checkAvailableOptions() && (
          <Box bgcolor="grid.content" className="optionsBox">
            <Options provider={provider} />
          </Box>
        )}
      {!provider.disable && !provider.isClone && provider.options.allowClones && (
        <Box className="cloneBox">
          <CloneProviderButton provider={provider} />
        </Box>
      )}
      {provider.isAdmin && provider.isClone && (
        <Box className="cloneBox">
          <CloneDeleteButton provider={provider} />
        </Box>
      )}
    </Box>
  );
};

export default Profile;
