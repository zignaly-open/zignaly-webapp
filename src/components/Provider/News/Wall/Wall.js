import React from "react";
import { Box } from "@material-ui/core";
import CreatePost from "../CreatePost";

const Wall = () => {
  return (
    <Box className="wall">
      <CreatePost />
    </Box>
  );
};
export default Wall;
