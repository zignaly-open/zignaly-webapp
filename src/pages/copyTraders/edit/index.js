import React, { useEffect, useState } from "react";
import "./edit.scss";
import { Box, CircularProgress } from "@material-ui/core";
import withProviderLayout from "../../../layouts/providerLayout";
import { compose } from "recompose";
import EditProfileForm from "../../../components/Forms/EditProfileForm";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";

const CopyTradersProfile = () => {
  const storeSession = useStoreSessionSelector();
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      alignItems="center"
      className="profileEditPage"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      {loading && <CircularProgress color="primary" />}
      {!loading && <EditProfileForm exchanges={exchanges} quotes={quotes} />}
    </Box>
  );
};

export default compose(withProviderLayout)(CopyTradersProfile);
