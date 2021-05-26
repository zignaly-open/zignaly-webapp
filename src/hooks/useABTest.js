import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTestAB } from "store/actions/settings";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";

/**
 * Load/initialize A/B test flag
 * @returns {boolean} Flag
 */
const useAPTest = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();
  // Load the saved a/b flag
  let showNew = storeSettings.testAB.login;

  useEffect(() => {
    if (showNew === null) {
      // If A/B flag wasn't set yet, set it randomly
      const enable = Math.random() < 0.5;
      dispatch(setTestAB({ page: "login", enable }));
    }
  }, [showNew]);

  return showNew;
};

export default useAPTest;
