import dayjs from "dayjs";

const initializeAuthData = {
  // ...initialState,
  session: {
    tradeApi: { accessToken: Cypress.env("token") },
    sessionData: {
      status: "active",
      validUntil: dayjs().add(2, "h").valueOf(),
    },
  },
  // user: {
  //   loaded: true,
  //   userData: { email: "" },
  // },
};

export default initializeAuthData;
