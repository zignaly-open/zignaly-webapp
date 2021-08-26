import React from "react";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

/**
 * @param {Object} props Props.
 * @param {string} props.message Message
 * @param {string} props.url Url
 * @returns {JSX.Element} JSX
 */
export const TooltipWithUrl = ({ message, url }) => {
  return (
    <Box alignItems="flex-start" display="flex" flexDirection="column" justifyContent="flex-start">
      <span>
        <FormattedMessage id={message} />
      </span>
      {url && (
        <a className="anchor" href={url} rel="noreferrer" target="_blank">
          <FormattedMessage id="srv.moreinfo" />
        </a>
      )}
    </Box>
  );
};
