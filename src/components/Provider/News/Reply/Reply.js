import React from "react";
import { Box, Typography } from "@material-ui/core";
import "./Reply.scss";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import { formatDate } from "../../../../utils/format";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').Post} Post
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Post} reply
 */

/**
 * Render a post.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const Reply = ({ reply }) => {
  return (
    <Box className="reply">
      <Box className="replyHeader" display="flex" alignItems="center">
        <ProviderLogo defaultImage={ProfileIcon} size="32px" title="" url={reply.author.imageUrl} />
        <Box className="replyMetaBox" display="flex">
          <Typography className="username body1">{reply.author.userName}</Typography>
          <Typography className="date callout1">{formatDate(reply.createdAt)}</Typography>
        </Box>
      </Box>
      {addLineBreaks(reply.content)}
    </Box>
  );
};

/**
 * Print string with line breaks
 * @param {string} string string
 * @returns {Array<JSX.Element>} JSX
 */
const addLineBreaks = (string) =>
  string.split("\n").map((text, index) => (
    <React.Fragment key={`${text}-${index}`}>
      {text}
      <br />
    </React.Fragment>
  ));

export default Reply;
