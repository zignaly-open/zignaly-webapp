import React, { useState } from "react";
import CustomButton from "../../CustomButton";
import Modal from "../../Modal";
import ConnectExchangeView from "../../ConnectExchangeView";
import { FormattedMessage } from "react-intl";

const ConnectExchangeButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CustomButton className="headerButton" onClick={() => setOpen(true)}>
        <FormattedMessage id="menu.connectexchange" />
      </CustomButton>
      <Modal onClose={() => setOpen(false)} persist={false} size="large" state={open}>
        <ConnectExchangeView onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
};

export default ConnectExchangeButton;
