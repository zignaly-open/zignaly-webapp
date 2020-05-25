import { combineReducers } from "redux";

import settings from "./settings";
import session from "./session";
import user from "./user";

export default combineReducers({
  session,
  settings,
  user,
});
