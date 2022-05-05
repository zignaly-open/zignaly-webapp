import React from "react";
import { useDispatch } from "react-redux";
import { showSuccessAlert } from "lib/store/actions/ui";
import { CopyIcon, IconButton } from "zignaly-ui";

const CopyButton = ({ content, successMessage }: { content: string; successMessage?: string }) => {
  const dispatch = useDispatch();

  const copyAddress = () => {
    navigator.clipboard.writeText(content).then(() => {
      if (successMessage) {
        dispatch(showSuccessAlert("Success", successMessage));
      }
    });
  };

  return <IconButton icon={<CopyIcon />} onClick={copyAddress} variant="flat" />;
};

export default CopyButton;
