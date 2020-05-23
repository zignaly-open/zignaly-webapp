import { combineReducers } from "redux";

import settings from "./settings";
import session from "./session";
import userExchanges from "./userExchanges";
import userBalance from "./userBalance";

export default combineReducers({
  session,
  settings,
  userExchanges,
  userBalance,
});
