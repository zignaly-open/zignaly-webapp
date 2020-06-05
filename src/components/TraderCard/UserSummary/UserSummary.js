import React from "react";
import "./UserSummary.scss";
import { Box, Typography } from "@material-ui/core";

const UserSummary = () => {
  return (
    <Box className="userSummary" display="flex" flexDirection="column" justifyContent="flex-start">
      <Typography variant="subtitle1">Allocated</Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">BTC 0.2</Typography>
        {/* <Typography variant="h5">$1280,46</Typography> */}
      </Box>
      <Typography variant="subtitle1">Return since copying</Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography className="green" variant="h5">
          7.2%
        </Typography>
        <Typography className="green" variant="h5">
          19%
        </Typography>
      </Box>
      <Typography variant="subtitle1">Open positions now</Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography className="red" variant="h5">
          .7%%
        </Typography>
        <Typography className="red" variant="h5">
          $2.4
        </Typography>
      </Box>
    </Box>
  );
};

export default UserSummary;
