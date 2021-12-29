import { Typography } from "@material-ui/core";
import styled from "styled-components";
import React from "react";

export const TransferPanel = styled.div`
  background-color: ${({ theme }) => theme.newTheme.backgroundAltColor};
  border: 1px dashed ${({ theme }) => (theme.palette.type === "dark" ? "#5A51F5" : "#a586e0")};
  margin: 0 16px;
  padding: 28px 20px;
  border-radius: 8px;
`;

export const TypographyLabel = styled(Typography)`
  font-weight: 600;
  font-size: 13px;
`;

export const TypographyAddress = styled(Typography)`
  font-size: 12px;
  margin-left: 16px;
`;

export const ProviderLink = ({
  providerId,
  providerName,
}: {
  providerId: string;
  providerName: string;
}) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={`${window.location.origin}${process.env.GATSBY_BASE_PATH}/profitSharing/${providerId}`}
  >
    {providerName}
  </a>
);

export const getStatusColor = (status: string, theme) => {
  switch (status) {
    case "SUCCESS":
    case "completed":
      return theme.newTheme.green;
    case "IN_PROGRESS":
    case "pending":
      return theme.newTheme.yellow;
    case "FAILED":
    case "error":
      return theme.newTheme.red;
    default:
      return null;
  }
};

export const getStatusTextId = (status: string) => {
  switch (status) {
    case "SUCCESS":
    case "completed":
      return "wallet.status.completed";
    case "IN_PROGRESS":
    case "pending":
      return "wallet.status.progress";
    case "FAILED":
    case "error":
      return "wallet.status.failed";
    default:
      return " ";
  }
};
