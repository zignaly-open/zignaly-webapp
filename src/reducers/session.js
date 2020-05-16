const USER_LOGIN = "USER_LOGIN_ACTION";

const settings = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN:
      state.tradeApi.accessToken = action.payload.token;
      return state;
    default:
      return state;
  }
};

export default settings;
