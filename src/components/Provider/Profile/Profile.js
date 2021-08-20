import React, { useEffect, useState, useRef } from "react";
import "./Profile.scss";
import { Box } from "@material-ui/core";
import AboutUs from "../../../components/Provider/Profile/AboutUs";
import Strategy from "../../../components/Provider/Profile/Strategy";
import WhoWeAre from "../../../components/Provider/Profile/WhoWeAre";
import Performance from "../../../components/Provider/Profile/Performance";
import OtherServices from "../../../components/Provider/Profile/OtherServices";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import CloneProviderButton from "../../../components/Provider/ProviderHeader/CloneProviderButton";
import CloneDeleteButton from "../../../components/Provider/ProviderHeader/ProviderDeleteButton";
import Modal from "../../../components/Modal";
import useSelectedExchange from "hooks/useSelectedExchange";
import Options from "../../../components/Provider/Profile/Options";
import PaymentResponse from "./PaymentResponse";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

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
  const selectedExchange = useSelectedExchange();
  const intl = useIntl();
  const [paymentModal, showPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const refLeftColumn = useRef(null);
  const refRightColumn = useRef(null);
  const [leftColumnBigger, setLeftColumnBigger] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Measure column heights to know where to add Other Services component.
    if (refLeftColumn.current.clientHeight) {
      setTimeout(() => {
        setLeftColumnBigger(
          !isMobile && refLeftColumn.current.clientHeight > refRightColumn.current.clientHeight,
        );
      }, 0);
    }
  }, [isMobile]);

  const checkPaymentStatus = () => {
    if (typeof window !== "undefined") {
      let url = window.location.href;
      if (url.includes("error")) {
        initStatus("error");
      }
      if (url.includes("success")) {
        initStatus("success");
      }
    }
  };

  /**
   *
   * @param {String} status Status string
   * @returns {Void} None.
   */
  const initStatus = (status) => {
    setPaymentStatus(status);
    showPaymentModal(true);
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

  const handleClose = () => {
    showPaymentModal(false);
    if (typeof window !== "undefined") {
      let url = window.location.href;
      history.pushState({}, status, url.split("#")[0]);
    }
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
      <Modal onClose={handleClose} size="small" state={paymentModal}>
        <PaymentResponse status={paymentStatus} />
      </Modal>
      <div className="leftColumn" ref={refLeftColumn}>
        <Box bgcolor="grid.content" className="aboutBox">
          <AboutUs provider={provider} />
        </Box>
        <Box bgcolor="grid.content" className="strategyBox">
          <Strategy provider={provider} />
        </Box>
        {leftColumnBigger === false && (
          <Box bgcolor="grid.content" className="Box">
            <OtherServices provider={provider} />
          </Box>
        )}
      </div>
      <div className="rightColumn" ref={refRightColumn}>
        <Box bgcolor="grid.content" className="whoWeAreBox">
          <WhoWeAre provider={provider} />
        </Box>
        {provider.isCopyTrading ? (
          <Box bgcolor="grid.content" className="performanceBox">
            <Performance provider={provider} />
          </Box>
        ) : (
          !provider.disable &&
          provider.exchangeInternalId === selectedExchange.internalId &&
          checkAvailableOptions() && (
            <Box bgcolor="grid.content" className="optionsBox">
              <Options provider={provider} />
            </Box>
          )
        )}
        {leftColumnBigger && (
          <Box bgcolor="grid.content" className="Box">
            <OtherServices provider={provider} />
          </Box>
        )}
      </div>
      {!provider.profitSharing &&
        !provider.disable &&
        !provider.isClone &&
        provider.options.allowClones && (
          <Box className="cloneBox">
            <CloneProviderButton provider={provider} />
          </Box>
        )}
      {!provider.profitSharing && provider.isAdmin && provider.isClone && (
        <Box className="cloneBox">
          <CloneDeleteButton provider={provider} />
        </Box>
      )}
    </Box>
  );
};

export default Profile;
