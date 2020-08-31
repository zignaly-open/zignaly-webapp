import { useState } from "react";
import { showErrorAlert } from "../store/actions/ui";
import { withPrefix } from "gatsby";
import { setAppVersion } from "../store/actions/session";
import { minToMillisec } from "../utils/timeConvert";
import useInterval from "./useInterval";
import { useDispatch } from "react-redux";
import useStoreSessionSelector from "./useStoreSessionSelector";

/**
 * @typedef {import("../components/Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
 */

/**
 * @typedef {Object} AppUpdateCheckHook
 * @property {ConfirmDialogConfig} confirmConfig Confirm dialog configuration.
 * @property {function} setConfirmConfig Callback to change confirm configuration state.
 * @property {function} executeRefresh Callback to execute application refresh.
 * @property {function} postponeRefresh Callback to postpone application refresh.
 */

/**
 * Hook that monitors application updates.
 *
 * This hook is used to ask for user app in-memory code refresh when new release is available.
 *
 * @returns {AppUpdateCheckHook} App update check hook object.
 */
const useAppUpdatesCheck = () => {
  const storeSession = useStoreSessionSelector();
  const currentVersion = storeSession.appVersion || "";
  const dispatch = useDispatch();
  const [latestVersion, setLatestVersion] = useState(currentVersion);
  const [intervalMinutes, setIntervalMinutes] = useState(1);
  const initConfirmConfig = {
    titleTranslationId: "confirm.appupdate.title",
    messageTranslationId: "confirm.appupdate.message",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);

  /**
   * Store the newest version and perform reload.
   *
   * @returns {Void} None.
   */
  const executeRefresh = () => {
    dispatch(setAppVersion(latestVersion));
    location.reload();
  };

  /**
   * Increase check interval if user decided to postpone the update.
   *
   * @returns {Void} None.
   */
  const postponeRefresh = () => {
    setIntervalMinutes(10);
  };

  const appUpdatesCheck = () => {
    try {
      fetch(withPrefix("version.json")).then(async (response) => {
        const version = (await response.json()) || null;

        // Version is not tracked yet so just set the latest version.
        if (!currentVersion) {
          dispatch(setAppVersion(version));
        }

        // App version update available, set new version in store and force refresh.
        if (currentVersion && version && currentVersion !== version) {
          setConfirmConfig({ ...confirmConfig, visible: true });
          setLatestVersion(latestVersion);
        }
      });
    } catch (e) {
      showErrorAlert(e);
    }
  };

  useInterval(appUpdatesCheck, minToMillisec(intervalMinutes), true);

  return {
    confirmConfig,
    executeRefresh,
    postponeRefresh,
    setConfirmConfig,
  };
};

export default useAppUpdatesCheck;
