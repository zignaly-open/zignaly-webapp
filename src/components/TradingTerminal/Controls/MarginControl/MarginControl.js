import React, { useState } from "react";
import { Box, Button, Switch, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { useFormContext } from "react-hook-form";
import LeverageForm from "../../LeverageForm/LeverageForm";
import Modal from "../../../Modal";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";
import HelperLabel from "../../HelperLabel/HelperLabel";
import "./MarginControl.scss";

/**
 * @typedef {import("services/tradeApiClient.types").MarketSymbol} MarketSymbol
 */

/**
 * Manual trading strategy panel component.
 *
 * @param {Object} props Props.
 * @param {MarketSymbol} props.symbolData Selected Symbol.
 * @returns {JSX.Element} JSX.
 */
const MarginControl = ({ symbolData }) => {
  const { register, watch, setValue } = useFormContext();
  const leverage = watch("leverage");
  const marginMode = watch("marginMode");
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedExchange } = useStoreSettingsSelector();
  const showCross = selectedExchange.exchangeName.toLowerCase() === "bitmex";
  const leverageEditable =
    marginMode !== "cross" || selectedExchange.exchangeName.toLowerCase() !== "bitmex";

  /**
   * Leverage mode change handler.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Change event.
   * @returns {void}
   */
  const handleModeChange = (event) => {
    setValue("marginMode", event.target.checked ? "cross" : "isolated");
  };

  return (
    <Box className="marginControl">
      <HelperLabel descriptionId="terminal.leverage.help" labelId="terminal.leverage" />

      <Box alignItems="center" display="flex" flexDirection="row">
        <Box
          className="leverageButton"
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
        >
          <Modal
            onClose={() => setModalVisible(false)}
            persist={false}
            size="small"
            state={modalVisible}
          >
            <LeverageForm
              leverage={parseInt(leverage)}
              max={symbolData.maxLeverage}
              min={1}
              onClose={() => {
                setModalVisible(false);
              }}
              setValue={setValue}
            />
          </Modal>
          {leverageEditable && (
            <Button onClick={() => setModalVisible(true)}>
              {marginMode === "cross"
                ? selectedExchange.exchangeName.toLowerCase() === "bitmex"
                  ? "Cross"
                  : `Cross ${leverage}x`
                : `${leverage}x`}
            </Button>
          )}
          <input name="leverage" ref={register} type="hidden" />
          <input name="marginMode" ref={register} type="hidden" />
        </Box>
        {showCross && (
          <Box alignItems="center" className="mode" display="flex" flexDirection="row">
            <Typography className="callout1">
              <FormattedMessage id="terminal.leverage.isolated" />
            </Typography>
            <Switch checked={marginMode === "cross"} onChange={handleModeChange} />
            <Typography className="callout1">
              <FormattedMessage id="terminal.leverage.cross" />
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MarginControl;
