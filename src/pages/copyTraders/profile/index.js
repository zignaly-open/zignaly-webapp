import React, { useEffect } from "react";
import "./profile.scss";
import { Box } from "@material-ui/core";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import AboutUs from "../../../components/Provider/Profile/AboutUs";
import Strategy from "../../../components/Provider/Profile/Strategy";
import WhoWeAre from "../../../components/Provider/Profile/WhoWeAre";
import Performance from "../../../components/Provider/Profile/Performance";
import Disclaimer from "../../../components/Provider/Profile/Disclaimer";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";

const CopyTradersProfile = () => {
  const storeViews = useStoreViewsSelector();
  const dispatch = useDispatch();

  const checkPaymentStatus = () => {
    if (typeof window !== undefined) {
      let url = window.location.href;
      if (url.includes("error")) {
        let error = {
          code: "paymentnotcompleted",
        };
        history.pushState({}, "error", url.split("#")[0]);
        dispatch(showErrorAlert(error));
      }
      if (url.includes("success")) {
        let success = {
          code: "paymentnotcompleted",
        };
        history.pushState({}, "success", url.split("#")[0]);
        dispatch(showErrorAlert(success));
      }
    }
  };

  useEffect(checkPaymentStatus, []);

  return (
    <Box
      alignItems="flex-start"
      className="profilePage"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="center"
    >
      <Box bgcolor="grid.main" className="aboutBox">
        <AboutUs provider={storeViews.provider} />
      </Box>
      <Box bgcolor="grid.main" className="whoWeAreBox">
        <WhoWeAre provider={storeViews.provider} />
      </Box>
      <Box bgcolor="grid.main" className="strategyBox">
        <Strategy provider={storeViews.provider} />
      </Box>
      <Box bgcolor="grid.main" className="performanceBox">
        <Performance provider={storeViews.provider} />
      </Box>
      <Disclaimer />
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersProfile);
