// Dependencies
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

// Styled Components
import { ModalContainer, Title, Body, Actions } from "../styles";

// Assets
// import { WarningOutline } from "react-ionicons";
import { Button } from "zignaly-ui";
import { closeModal } from "lib/store/actions/ui";

type ErrorModalTypesProps = {
  title: string;
  description: string;
  action?: any;
};

function ErrorModal({
  title,
  description,
  action = null,
}: ErrorModalTypesProps): React.ReactElement {
  // Hooks
  const dispatch = useDispatch();

  /**
   * @function handleDefaultAction
   * @description handle the default action
   */
  const handleDefaultAction = useCallback(() => {
    dispatch(closeModal());
  }, []);

  return (
    <ModalContainer width={420}>
      {/* <WarningOutline color={"#ffa837"} height={"46px"} width={"46px"} /> */}
      <Title>{title}</Title>
      <Body>{description}</Body>
      <Actions>
        <Button caption="Ok" onClick={action ?? handleDefaultAction} />
      </Actions>
    </ModalContainer>
  );
}

export default ErrorModal;
