import React from "react";
import { Box } from "@material-ui/core";
import CreatePost from "../CreatePost";
import Posts from "../Posts";
import "./Wall.scss";

const Wall = ({ provider }) => {
  return (
    <Box className="wall">
      {provider.isAdmin && <CreatePost providerId={provider.id} />}
      <Posts providerId={provider.id} />
    </Box>
  );
};
export default Wall;
