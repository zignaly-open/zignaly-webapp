import React from "react";
import { Box, Typography } from "@material-ui/core";

const UserSummary = props => {
  const { data } = props;
  let id = "traderCard" + data;

  return (
    <Box display="flex" flexDirection="column" justifyContent="flex-start" className="userSummary">
      <Typography variant="subtitle1">Allocated</Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">BTC 0.2</Typography>
        <Typography variant="h5">$1280,46</Typography>
      </Box>
      <Typography variant="subtitle1">Return since copying</Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5" className="green">
          7.2%
        </Typography>
        <Typography variant="h5" className="green">
          19%
        </Typography>
      </Box>
      <Typography variant="subtitle1">Open positions now</Typography>
      <Box className="returns" display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5" className="red">
          .7%%
        </Typography>
        <Typography variant="h5" className="red">
          $2.4
        </Typography>
      </Box>
    </Box>
  );
};

export default UserSummary;
