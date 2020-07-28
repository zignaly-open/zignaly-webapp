import { useState, useEffect } from "react";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

const useProfileBoxShow = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [show, setShow] = useState(true);

  const initShow = () => {
    if (!isMobile) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(initShow, [isMobile]);

  return { show, setShow, isMobile };
};

export default useProfileBoxShow;
