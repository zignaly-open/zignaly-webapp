import React, { Fragment, useState } from "react";
import CustomButton from "../../CustomButton";
import Modal from "../../Modal";
import ConnectExchangeView from "../../ConnectExchangeView";
import { FormattedMessage } from "react-intl";

const ConnectExchangeButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <CustomButton className="headerButton" onClick={() => setOpen(true)}>
        <FormattedMessage id="menu.connectexchange" />
      </CustomButton>
      <Modal size="large" persist={false} state={open} onClose={() => setOpen(false)}>
        <ConnectExchangeView onClose={() => setOpen(false)} />
      </Modal>
    </Fragment>
  );
};

export default ConnectExchangeButton;
