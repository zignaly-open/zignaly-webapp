import React, { useState } from "react";
import "./ConnectExchangeView.scss";
import { Box } from "@mui/material";
import ConnectExchangeViewContent from "./ConnectExchangeViewContent";
import ConnectExchangeViewHead from "./ConnectExchangeViewHead";
import ModalPathContext from "./ModalPathContext";
import { useForm, FormProvider } from "react-hook-form";
import useModalPath from "../../hooks/useModalPath";
import FAQ from "../FAQ";
import { debounce } from "lodash";

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 * @property {React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>} onSearch Search callback
 */

/**
 * Connect exchange component.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Connect exchange element.
 */
const ConnectExchangeView = ({ onClose, onSearch }) => {
  const methods = useForm({
    mode: "onBlur",
  });
  const modalPath = useModalPath();

  const [search, setSearch] = useState("");

  const lazySearch = debounce(setSearch, 100);

  onSearch = (e) => {
    lazySearch(e.target.value);
  };

  return (
    <ModalPathContext.Provider value={modalPath}>
      <FormProvider {...methods}>
        <Box
          alignItems="flex-start"
          className="connectExchangeView"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <ConnectExchangeViewHead onClose={onClose} onSearch={(e) => onSearch(e)} />
          <ConnectExchangeViewContent searchFilter={search} />
          <FAQ />
        </Box>
      </FormProvider>
    </ModalPathContext.Provider>
  );
};

export default ConnectExchangeView;
