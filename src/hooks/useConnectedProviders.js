// import { useState, useEffect } from "react";
// import tradeApi from "../services/tradeApiClient";
// import { showErrorAlert } from "../store/actions/ui";
// import { useDispatch } from "react-redux";
// /**
//  * @typedef {import("../services/tradeApiClient.types").ProvidersCollection} ProvidersCollection
//  * @typedef {import("../services/tradeApiClient.types").ProvidersPayload} ProvidersPayload
//  */

// /**
//  * Get list of connected providers.
//  *
//  * @param {number} timeFrame TimeFrame for returns.
//  * @param {string} internalExchangeId Filter by internal exchange id.
//  * @param {Array<'signal'|'copytraders'|'profitsharing'>} provType Flag to indicate if it should returns only the copy traders.
//  * @returns {ProvidersCollection} Connected Providers.
//  */
// const useConnectedProviders = (timeFrame, internalExchangeId, provType) => {
//   const [providers, setProviders] = useState([]);
//   const dispatch = useDispatch();

//   const loadData = () => {
//     /**
//      * @type {ProvidersPayload}
//      */
//     const payload = {
//       timeFrame,
//       provType,
//       type: "connected",
//       ...(internalExchangeId && { internalExchangeId }),
//     };

//     tradeApi
//       .providersGet(payload)
//       .then((data) => {
//         setProviders(data);
//       })
//       .catch((e) => {
//         dispatch(showErrorAlert(e));
//       });
//   };
//   useEffect(loadData, [internalExchangeId, timeFrame]);

//   return providers;
// };

// export default useConnectedProviders;
