import React from "react";
import { Box } from "@material-ui/core";
import CreatePost from "../CreatePost";

const Wall = ({ providerId }) => {
  return (
    <Box className="wall">
      <CreatePost providerId={providerId} />
    </Box>
  );
};
export default Wall;
