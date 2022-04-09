import { useDispatch, useSelector } from "react-redux";
import { UserEntity } from "src/services/tradeApiClient.types";
import { endTradeApiSession, startTradeApiSession } from "src/store/actions/session";
import { setSelectedExchange } from "src/store/actions/settings";
import { analyticsTrigger } from "src/utils/analyticsJsApi";
import gtmPushApi from "src/utils/gtmPushApi";
import { endLiveSession, startLiveSession } from "src/utils/liveSessionApi";
import useAPI from "./useAPI";
import useRedirection from "./useRedirection";
import { keys, setItemCache } from "lib/cache";

export const isSessionValid = (sessionData: GetSessionRes) =>
  sessionData && sessionData.validUntil * 1000 > new Date().getTime();

const initExternalWidgets = (userData, eventType) => {
  const { gtmEvent } = gtmPushApi();
  const gtmpEventType = {
    event: eventType,
  };

  if (gtmEvent) {
    gtmEvent.push({ ...gtmpEventType, ...userData });
  }

  analyticsTrigger(userData, eventType);

  if (eventType === "signup") {
    startLiveSession(userData);
  }
};

const initSelectedExchange = (user: UserEntity, selectedExchangeId: string) => {
  if (user?.exchanges.length) {
    const selectedExchange = user.exchanges.find((e) => e.internalId === selectedExchangeId);
    if (selectedExchange) {
      // Use last saved selected exchange
      return selectedExchangeId;
    } else {
      // If no exchange account saved, use the first one
      return user.exchanges[0].internalId;
    }
  }
  return null;
};

const clearCache = () => {
  const keysToRemove = [keys.session, keys.user];
  keysToRemove.forEach((k) => localStorage.removeItem(k));
};

export const useSession = () => {
  const dispatch = useDispatch();
  const { redirectDashboard, redirectLogin } = useRedirection();
  const { getUserData } = useAPI();
  const selectedExchangeId = useSelector((state: any) => state.settings.selectedExchangeId);

  const startSession = async (token, type: "login" | "signup") => {
    dispatch(startTradeApiSession(token));
    const user = await getUserData(token);
    // Save user in cache and mark it as validated to avoid being reloaded by useUser
    setItemCache(keys.user, { ...user, _validated: true });
    // Init 3rd party scripts
    initExternalWidgets(user, type);
    // Init selected exchange
    dispatch(setSelectedExchange(initSelectedExchange(user, selectedExchangeId)));

    redirectDashboard();
  };

  const endSession = async () => {
    dispatch(endTradeApiSession());
    clearCache();
    endLiveSession();
    redirectLogin();
  };

  return { startSession, endSession };
};
