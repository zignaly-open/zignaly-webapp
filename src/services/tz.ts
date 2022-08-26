type tzData = {
  action: string;
  urlReferer?: string;
  urlDestination?: string;
  userId?: string;
  tzid?: string;
};

import ModalPathContext from "components/ConnectExchangeView/ModalPathContext";
import { useStoreUserData } from "hooks/useStoreUserSelector.js";
import { useContext } from "react";
import { UserEntity } from "./tradeApiClient.types";

/**
 * Send tz action.
 */
const sendTz = (data: tzData) => {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(process.env.GATSBY_TRADEAPI_URL + "/fe/tz.php", options);
};

/**
 * Trigger internal tracking event.
 */
export const triggerTz = async (location: string, userData: UserEntity, prevLocation?: string) => {
  if (userData.isAdmin || process.env.GATSBY_ENABLE_TRACKING !== "true") return;

  const data = {
    action: "sData",
    urlReferer: prevLocation || document.referrer,
    urlDestination: location,
    userId: userData.userId,
    tid: localStorage.getItem("tid"),
  };

  if (!data.tid) {
    // get tid
    sendTz({
      action: "gTid",
    }).then(async (response) => {
      const json = await response.json();
      if (!response.ok) {
        const customError = json.error || json;
        throw customError;
      }
      data.tid = json;
      localStorage.setItem("tid", json);
      sendTz(data);
    });
  } else {
    sendTz(data);
  }
};

export const composeHash = (originalHash: string, ctaId: string, accountInternalId: string) => {
  let hash = originalHash;
  if (ctaId) {
    hash += `?ctaId=${ctaId}`;

    if (accountInternalId) {
      hash += "&accId=" + accountInternalId;
    }
  }
  return hash;
};

/**
 * Track click event
 */
export const useTz = () => {
  const storeUserData = useStoreUserData();
  const { pathParams } = useContext(ModalPathContext);

  return (ctaId: string, accountInternalId?: string) => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const hash = window.location.href.split("#")[1]?.split("?")[0];
    url.hash = composeHash(hash, ctaId, accountInternalId);
    triggerTz(url.toString(), storeUserData);
  };
};
