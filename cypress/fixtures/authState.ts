import dayjs from "dayjs";
import { getUserData } from "utils/mirage/server";
import initialState from "../../src/store/initialState";

const initializeAuthData = (user: User) => ({
  // ...initialState,
  session: {
    tradeApi: { accessToken: Cypress.env("token") },
    sessionData: {
      status: "active",
      validUntil: dayjs().add(2, "h").valueOf(),
    },
  },
  user: {
    loaded: true,
    userData: getUserData(user),
  },
  settings: {
    ...initialState.settings,
    selectedExchangeId: user?.exchanges.length ? user.exchanges[0].internalId : null,
  },
});

export default initializeAuthData;
