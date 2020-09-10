import React from "react";
import { Box, Paper } from "@material-ui/core";
import Editor from "../../../Editor";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import "./Post.scss";

const Post = ({ post }) => {
  return (
    <Box className="post">
      {/* <Editor content={post.content} /> */}
      <Paper className="postContent">
        <ReactMarkdown linkTarget="_blank" plugins={[breaks]} source={post.content} />
      </Paper>
    </Box>
  );
};
export default Post;
