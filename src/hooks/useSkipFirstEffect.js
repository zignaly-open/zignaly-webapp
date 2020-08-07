import { useEffect, useRef } from "react";

const useSkipFirstEffect = (callback, dependencies) => {
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    callback();
  }, dependencies);
};

export default useSkipFirstEffect;
