import { useState, useEffect } from "react";

/**
 * @type {Array<string>}
 */
const cachedScripts = [];

/**
 * Load script from URL source.
 *
 * @param {string} sourceUrl Script source URL.
 * @returns {Array<boolean>} Load / error status.
 */
const useScript = (sourceUrl) => {
  const [state, setState] = useState({
    loaded: false,
    error: false,
  });

  const loadScript = () => {
    if (!sourceUrl) return () => {};

    if (cachedScripts.includes(sourceUrl)) {
      setState({
        loaded: true,
        error: false,
      });

      return () => {};
    }

    cachedScripts.push(sourceUrl);
    const script = document.createElement("script");
    script.src = sourceUrl;
    script.async = true;

    // Script event listener callbacks for load and error.
    const onScriptLoad = () => {
      setState({
        loaded: true,
        error: false,
      });
    };

    const onScriptError = () => {
      const index = cachedScripts.indexOf(sourceUrl);
      if (index >= 0) cachedScripts.splice(index, 1);
      script.remove();

      setState({
        loaded: true,
        error: true,
      });
    };

    script.addEventListener("load", onScriptLoad);
    script.addEventListener("error", onScriptError);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", onScriptLoad);
      script.removeEventListener("error", onScriptError);
    };
  };

  useEffect(loadScript, [sourceUrl]);

  return [state.loaded, state.error];
};
export default useScript;
