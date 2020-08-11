import { showErrorAlert } from "../store/actions/ui";
import { withPrefix } from "gatsby";
import useInterval from "./useInterval";
import { minToMillisec } from "../../types/utils/timeConvert";
import useStoreSessionSelector from "./useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setAppVersion } from "../store/actions/session";

const useAppUpdatesCheck = () => {
  const storeSession = useStoreSessionSelector();
  const currentVersion = storeSession.appVersion || "";
  const dispatch = useDispatch();

  const appUpdatesCheck = () => {
    try {
      fetch(withPrefix("version.json")).then(async (response) => {
        const data = (await response.json()) || { version: null };

        // Version is not tracked yet so just set the latest version.
        if (!currentVersion) {
          dispatch(setAppVersion(data.version));
        }

        // App version update available, set new version in store and force refresh.
        if (currentVersion && currentVersion !== data.version) {
          dispatch(setAppVersion(data.version));
          location.reload();
        }
      });
    } catch (e) {
      showErrorAlert(e);
    }
  };

  useInterval(appUpdatesCheck, minToMillisec(1), true);
};

export default useAppUpdatesCheck;
