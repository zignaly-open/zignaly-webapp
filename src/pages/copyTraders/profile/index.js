import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";
/**
 * @typedef {Object} CopyTradersProfilePageProps
 * @property {String} path
 * @property {String} providerId
 */

/**
 * Position detail page component.
 *
 * @param {CopyTradersProfilePageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */

const CopyTradersProfile = ({ providerId, path }) => {
  const storeSession = useStoreSessionSelector();

  useEffect(() => {
    const loadProvider = async () => {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: providerId,
      };
      const response = await tradeApi.providerGet(payload);
      console.log(response);
    };

    loadProvider();
  }, [providerId]);

  return <Box>dynamic route for {path}</Box>;
};

export default CopyTradersProfile;
