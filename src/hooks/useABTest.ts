import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { setTestAB } from "store/actions/settings";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";

/**
 * Load/initialize A/B test flag
 * @returns {boolean} Flag
 */
const useABTest = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();

  // Load the saved a/b flag unless already specified in url
  let storeShowNew = storeSettings.testAB.login;

  // Load version if set in url
  const hash = typeof window === "object" ? window.location.hash : null;

  const res = useMemo(() => {
    let urlShowNew = null as boolean;
    const versionMatch = hash?.match(/#v=(\d)/);
    if (versionMatch?.length && versionMatch[1] !== undefined) {
      urlShowNew = versionMatch[1] === "2";
    }

    if (storeShowNew === null || (urlShowNew !== null && urlShowNew !== storeShowNew)) {
      // If A/B flag wasn't set yet, set it randomly unless already specified in url
      const enable = urlShowNew !== null ? urlShowNew : Math.random() < 0.5;
      dispatch(setTestAB({ page: "login", enable }));
      return enable;
    }
    return storeShowNew;
  }, []);

  return res;
};

export default useABTest;
