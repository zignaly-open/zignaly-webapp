import React, { useEffect, useState } from "react";
import "./edit.scss";
import { Box } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import EditProfileForm from "../../../components/Forms/EditProfileForm";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { showLoader } from "../../../store/actions/ui";

const CopyTradersProfile = () => {
  const storeSession = useStoreSessionSelector();
  const [quotes, setQuotes] = useState({});
  const [exchanges, setExchanges] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader(true));
      const quotePayload = {
        token: storeSession.tradeApi.accessToken,
        ro: true,
      };
      const quotesResponse = await tradeApi.quotesAssetsGet(quotePayload);
      const exchangePayload = {
        token: storeSession.tradeApi.accessToken,
      };
      const exchangeResponse = await tradeApi.exchangeListGet(exchangePayload);
      setExchanges(exchangeResponse);
      setQuotes(quotesResponse);
      dispatch(showLoader(false));
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="profileEditPage">
      <EditProfileForm quotes={quotes} exchanges={exchanges} />
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersProfile);
