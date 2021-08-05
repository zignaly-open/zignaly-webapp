import { useEffect, useState, useRef } from "react";
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
 * @property {function} isNewVersionAvailable Utility function to check if new webapp version is available.
 */

/**
 * Hook that monitors application updates.
 *
 * This hook is used to ask for user app in-memory code refresh when new release is available.
 *
 * @param {boolean} enableInterval Determine if periodic version update should be enabled.
 *
 * @returns {AppUpdateCheckHook} App update check hook object.
 */
const useAppUpdatesCheck = (enableInterval = true) => {
  const storeSession = useStoreSessionSelector();
  const loadedVersion = storeSession.appVersion || "";
  const dispatch = useDispatch();
  const latestVersion = useRef(loadedVersion);
  const [intervalMills, setIntervalMills] = useState(enableInterval ? minToMillisec(1) : null);
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
    dispatch(setAppVersion(latestVersion.current));

    // Redux persist takes few milliseconds since update is notified and
    // persisted to local storage so refresh need to wait a bit.
    setTimeout(() => {
      location.reload();
    }, 300);
  };

  /**
   * Increase check interval if user decided to postpone the update.
   *
   * @returns {Void} None.
   */
  const postponeRefresh = () => {
    setIntervalMills(minToMillisec(10));
  };

  /**
   * Check if most recent version than loaded in memory is available.
   *
   * @returns {Promise<boolean>} TRUE when new update is available, FALSE otherwise.
   */
  const isNewVersionAvailable = async () => {
    try {
      const response = await fetch(withPrefix("version.json"));
      const version = (await response.json()) || null;

      // Version is not tracked yet so just set the latest version.
      if (!loadedVersion) {
        dispatch(setAppVersion(version));
      }

      // App version update available, set new version in store and force refresh.
      if (loadedVersion && version && loadedVersion !== version) {
        latestVersion.current = version;
        return true;
      }
    } catch (e) {
      // Not supported for cypress
    }

    return false;
  };

  const appUpdatesCheck = () => {
    isNewVersionAvailable().then((update) => {
      if (update) {
        setConfirmConfig({ ...confirmConfig, visible: true });
      }
    });
  };

  useInterval(appUpdatesCheck, intervalMills, false);

  const afterLogin = () => {
    // Trigger post login application update when new version is available.
    if (storeSession.sessionData.validUntil && storeSession.tradeApi.accessToken) {
      isNewVersionAvailable().then((/** @type {boolean} */ update) => {
        if (update) {
          executeRefresh();
        }
      });
    }
  };

  useEffect(afterLogin, [storeSession.sessionData.validUntil]);

  return {
    confirmConfig,
    executeRefresh,
    postponeRefresh,
    setConfirmConfig,
    isNewVersionAvailable,
  };
};

export default useAppUpdatesCheck;
