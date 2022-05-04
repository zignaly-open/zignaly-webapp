const initialState = {
  session: {
    tradeApi: {
      accessToken: "",
    },
    sessionData: {
      validUntil: 0,
      userId: "",
    },
  },
  settings: {
    locale: "en_US",
    darkStyle: false,
    rowsPerPage: {},
    selectedExchangeId: null,
    selectedServiceId: null,
    hiddenColumns: {},
    sortColumns: {},
  },
  ui: {
    alerts: {
      success: {
        title: "",
        body: "",
        open: false,
      },
      error: {
        title: "",
        body: "",
        open: false,
      },
    },
    ask2FA: false,
    modal: {
      id: null,
      data: null,
    },
  },
};

export default initialState;
