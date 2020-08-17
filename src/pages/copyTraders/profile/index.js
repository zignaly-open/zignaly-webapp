import React, { useEffect } from "react";
import "./profile.scss";
import { Box } from "@material-ui/core";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import AboutUs from "../../../components/Provider/Profile/AboutUs";
import Strategy from "../../../components/Provider/Profile/Strategy";
import WhoWeAre from "../../../components/Provider/Profile/WhoWeAre";
import Performance from "../../../components/Provider/Profile/Performance";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import CloneProviderButton from "../../../components/Provider/ProviderHeader/CloneProviderButton";
import CloneDeleteButton from "../../../components/Provider/ProviderHeader/CloneDeleteButton";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { setProvider } from "../../../store/actions/views";

const CopyTradersProfile = () => {
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  const dispatch = useDispatch();
  const intl = useIntl();

  const checkPaymentStatus = () => {
    if (typeof window !== "undefined") {
      let url = window.location.href;
      const idIndex = process.env.GATSBY_BASE_PATH === "" ? 2 : 3;
      const providerId = location.pathname.split("/")[idIndex];
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: providerId,
        version: 2,
      };
      if (url.includes("error")) {
        let error = {
          code: "paymentnotcompleted",
        };
        history.pushState({}, "error", url.split("#")[0]);
        dispatch(showErrorAlert(error));
        dispatch(setProvider(payload));
      }
      if (url.includes("success")) {
        history.pushState({}, "success", url.split("#")[0]);
        dispatch(showSuccessAlert("alert.payment.title", "alert.payment.body"));
        dispatch(setProvider(payload));
      }
    }
  };

  useEffect(checkPaymentStatus, []);

  return (
    <Box
      alignItems="flex-start"
      className="traderProfilePage"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="center"
    >
      <Helmet>
        <title>
          {`${storeViews.provider.name} - ${intl.formatMessage({
            id: "srv.profile",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      <Box className="leftColumn">
        <Box bgcolor="grid.content" className="aboutBox">
          <AboutUs provider={storeViews.provider} />
        </Box>
        <Box bgcolor="grid.content" className="strategyBox">
          <Strategy provider={storeViews.provider} />
        </Box>
      </Box>
      <Box className="rightColumn">
        <Box bgcolor="grid.content" className="whoWeAreBox">
          <WhoWeAre provider={storeViews.provider} />
        </Box>
        <Box bgcolor="grid.content" className="performanceBox">
          <Performance provider={storeViews.provider} />
        </Box>
      </Box>
      {!storeViews.provider.disable &&
        !storeViews.provider.isClone &&
        storeViews.provider.options.allowClones && (
          <Box className="cloneBox">
            <CloneProviderButton provider={storeViews.provider} />
          </Box>
        )}
      {storeViews.provider.isAdmin && storeViews.provider.isClone && (
        <Box className="cloneBox">
          <CloneDeleteButton provider={storeViews.provider} />
        </Box>
      )}
    </Box>
  );
};

export default CopyTradersProfile;
