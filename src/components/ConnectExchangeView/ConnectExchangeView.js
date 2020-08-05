import React from "react";
import "./ConnectExchangeView.scss";
import { Box } from "@material-ui/core";
import ConnectExchangeViewContent from "./ConnectExchangeViewContent";
import ConnectExchangeViewHead from "./ConnectExchangeViewHead";
import ModalPathContext from "./ModalPathContext";
import { useForm, FormProvider } from "react-hook-form";
import useModalPath from "../../hooks/useModalPath";
import FAQ from "../FAQ";

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 */

/**
 * Connect exchange component.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Connect exchange element.
 */
const ConnectExchangeView = ({ onClose }) => {
  const methods = useForm({
    mode: "onBlur",
  });
  const modalPath = useModalPath();

  return (
    <ModalPathContext.Provider value={modalPath}>
      <FormProvider {...methods}>
        <Box
          alignItems="center"
          className="connectExchangeView"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <ConnectExchangeViewHead onClose={onClose} />
          <ConnectExchangeViewContent />
          <FAQ />
        </Box>
      </FormProvider>
    </ModalPathContext.Provider>
  );
};

export default ConnectExchangeView;
