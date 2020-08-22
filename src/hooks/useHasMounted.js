import { useState, useEffect } from "react";

/**
 * Flag to check if component has mounted
 *
 * @returns {boolean} Mount status.
 */
const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
};

export default useHasMounted;
