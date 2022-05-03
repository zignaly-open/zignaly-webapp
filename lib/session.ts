import { useDispatch, useSelector } from "react-redux";
import { UserEntity } from "src/services/tradeApiClient.types";
import { endTradeApiSession, startTradeApiSession } from "src/store/actions/session";
import { setSelectedExchange } from "src/store/actions/settings";
import { analyticsTrigger } from "src/utils/analyticsJsApi";
import gtmPushApi from "src/utils/gtmPushApi";
import { endLiveSession, startLiveSession } from "src/utils/liveSessionApi";
import useAPI from "./hooks/useAPI";
import useRedirection from "./hooks/useRedirection";
import { clearCache, keys, setItemCache } from "lib/cacheAPI";
import { useSWRConfig } from "swr";

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

export const useSession = () => {
  const dispatch = useDispatch();
  const { redirectDashboard, redirectLogin } = useRedirection();
  const { getUserData } = useAPI();
  const selectedExchangeId = useSelector((state: any) => state.settings.selectedExchangeId);
  const { cache } = useSWRConfig();

  const startSession = async (token, type: "login" | "signup") => {
    dispatch(startTradeApiSession(token));
    const user = await getUserData(token);
    // Save user in cache and mark it as validated to avoid being reloaded by useUser
    setItemCache(keys.user, { ...user, _validated: true });
    // Init 3rd party scripts
    initExternalWidgets(user, type);
    // Init selected exchange
    dispatch(setSelectedExchange(initSelectedExchange(user, selectedExchangeId)));

    redirectDashboard(true);
  };

  const endSession = async (withReturnUrl: boolean) => {
    dispatch(endTradeApiSession());
    // Clear local storage cache
    clearCache();
    // Clear swr cache to avoid returning response belonging to previous user.
    // As an improvement we could pass the token to useSWR([path, token]) to cache specific
    // @ts-ignore
    cache.clear();
    endLiveSession();
    redirectLogin(withReturnUrl);
  };

  return { startSession, endSession };
};
