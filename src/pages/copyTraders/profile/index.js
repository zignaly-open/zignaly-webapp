import React from "react";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import Profile from "../../../components/Provider/Profile";

const CopyTradersProfile = () => {
  const storeViews = useStoreViewsSelector();

  return <Profile provider={storeViews.provider} />;
};

export default CopyTradersProfile;
