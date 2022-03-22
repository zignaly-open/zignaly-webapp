import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const useProfileBoxShow = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
