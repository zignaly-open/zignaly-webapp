import React, { useState } from "react";
import useSelectedExchange from "hooks/useSelectedExchange";
import "./ConfirmTwoFADisableForm.scss";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showSuccessAlert, showErrorAlert } from "../../../store/actions/ui";
import { FormControl, Select, MenuItem, Input } from "@material-ui/core";

/**
 * Provides a convert coin modal.
 *
 * @typedef {Object} DefaultProps
 * @property {string | React.ReactNode} base Table title.
 * @property {Array<ExchangeAsset>} coinList
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const ConvertCoinForm = ({coinList, base}) => {
    const [loading, setLoading] = useState(false);
    const [quotes, setQuotes] = useState([]);

    const selectedExchange = useSelectedExchange();
    const dispatch = useDispatch();

    /**
    * Data returned at form submition.
    *
    * @param {DataObject} data form data received by the submit method.
    * @returns {void}
    */
    const onSubmit = (data) => {
        tradeApi.convertCoinPost(selectedExchange.internalId, data)
        .then(() => {
            dispatch(showSuccessAlert("", "exchange.convert.success"));
            // TODO: refresh balance
        })
        .catch((e) => {
            dispatch(showErrorAlert(e));
        })
        .finally(() => {
            setLoading(false);
        })
    }

    /**
    * Data returned when qty change.
    *
    * @param {DataObject} data form data received by the on change method.
    * @returns {void}
    */
    const onQtyChange = (data) => {
        tradeApi.convertCoinPreviewPost(selectedExchange.internalId, data)
        .then(() => {
            // TODO: show message in modal about estimated received value
        })
        .catch((e) => {
            dispatch(showErrorAlert(e));
        })
        .finally(() => {
            setLoading(false);
        })
    }

    /**
    * Build quote when base change
    *
    * @param {string} base base currency
    * @returns {void}
    */
    const onBaseChange = (base) => {
        tradeApi.getQuoteAssetFromBase(base)
        .then((quotes) => {
            setQuotes(quotes);
        })
        .catch((e) => {
            dispatch(showErrorAlert(e));
        })
        .finally(() => {
            setLoading(false);
        })
    }

    return (
        <form method="post" onSubmit={handleSubmit(onSubmit)}>

        <FormControl>
            <Select
            value={base}
            onChange={onBaseChange}
            input={<Input name="base" id="base" />}
            >
                {coinList.map((item) => {
                    <MenuItem value={item.coin}>item.coin</MenuItem>
                })}
            </Select>

            <Select
            value={quotes}
            input={<Input name="quote" id="quote" />}
            >
                {quotes.map((item) => {
                    <MenuItem value={item.quote}>item.quote</MenuItem>
                })}
            </Select>

            <TextField id="qty" label="Quantity" variant="outlined" />

            <CustomButton className="submitButton" loading={loading} type="submit">
                <FormattedMessage id="exchange.coin.convert" />
            </CustomButton>
        </FormControl>

        </form>
    )
}