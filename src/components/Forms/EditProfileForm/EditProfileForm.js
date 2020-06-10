import React, { useState, useEffect } from "react";
import "./EditProfileForm.scss";
import {
  Box,
  TextField,
  Typography,
  Switch,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import RichTextEditor from "react-rte";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import CountrySelect from "./CountrySelect";
import HelpIcon from "@material-ui/icons/Help";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";

/**
 *
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeListEntity} ExchangeListEntity
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').QuoteAssetsDict} quotes
 * @property {Array<ExchangeListEntity>} exchanges
 */

/**
 *
 * @param {DefaultProps} props
 */

const CopyTraderEditProfileForm = ({ quotes, exchanges }) => {
  const [loading, setLoading] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  const storeViews = useStoreViewsSelector();
  const { errors, handleSubmit, control } = useForm();
  const [about, setAbout] = useState(
    RichTextEditor.createValueFromString(storeViews.provider.shortDesc, "html"),
  );
  const [strategy, setStrategy] = useState(
    RichTextEditor.createValueFromString(storeViews.provider.longDesc, "html"),
  );
  const [selectedCountires, setselectedCountries] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState({ id: "", type: [] });
  const [selectedQuote, setSelectedQuote] = useState("");
  const [selectedExchangeType, setSelectedExchangeType] = useState("");

  useEffect(() => {
    let list = Object.values(quotes);
    setSelectedQuote(list.length ? list[0].quote.toLowerCase() : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes]);

  useEffect(() => {
    setSelectedExchange(exchanges.length ? exchanges[0] : { id: "", type: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchanges]);

  useEffect(() => {
    if (exchanges.length && selectedExchange.id) {
      let found = exchanges.find((item) => item.id === selectedExchange.id);
      if (found) {
        setSelectedExchangeType(found.type[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExchange]);

  /**
   *
   * @param {React.ChangeEvent<*>} e
   */
  const handleExchangeChange = (e) => {
    let value = e.target.value;
    let found = exchanges.find((item) => item.id === value);
    if (found) {
      setSelectedExchange(found);
    }
  };

  /**
   *
   * @param {React.ChangeEvent<*>} e
   */
  const handleExchangeTypeChange = (e) => {
    setSelectedExchangeType(e.target.value);
  };

  /**
   *
   * @param {React.ChangeEvent<*>} e
   */
  const handleQuoteChange = (e) => {
    setSelectedQuote(e.target.value);
  };

  /**
   *
   * @typedef {Object} SubmitObject
   * @property {String} name
   */
  /**
   *
   * @param {SubmitObject} data Form data.
   * @returns {Promise<*>} Returns promise.
   */
  const onSubmit = async (data) => {
    const params = {
      countries: selectedCountires,
      name: data.name,
    };
    try {
      setLoading(true);
    } catch (e) {
      alert(e.message);
    }
  };

  /**
   *
   * @param {*} list
   */

  const handleCountryChange = (list) => {
    setselectedCountries(list);
  };

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleSubmitClick = () => {
    handleSubmit(onSubmit);
  };

  /**
   *
   * @typedef {Object} EditorObject
   * @property {Function} toString
   */

  /**
   *
   * @param {EditorObject} value
   */

  const handleAboutChange = (value) => {
    setAbout(value);
  };

  /**
   *
   * @param {EditorObject} value
   */

  const handleStrategyChange = (value) => {
    setStrategy(value);
  };

  return (
    <Box bgcolor="grid.main" className="formWrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          alignItems="flex-start"
          className="copyTraderEditProfileForm"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="flex-start"
        >
          <Box bgcolor="grid.main" className="aboutBox">
            <Typography variant="h3">
              <FormattedMessage id="srv.about" />
            </Typography>
            <RichTextEditor className="editor" onChange={handleAboutChange} value={about} />
          </Box>

          <Box
            className="whoWeAreBox"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
          >
            <Typography variant="h3">
              <FormattedMessage id="srv.who" />
            </Typography>
            <CountrySelect onChange={handleCountryChange} />
          </Box>

          <Box bgcolor="grid.main" className="strategyBox">
            <Typography variant="h3">
              <FormattedMessage id="srv.strategy" />
            </Typography>
            <RichTextEditor className="editor" onChange={handleStrategyChange} value={strategy} />
          </Box>

          <Box
            bgcolor="grid.main"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
            className="performanceBox"
          >
            <Box className="inputBox" display="flex" flexDirection="column">
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                Title
              </label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    error={!!errors.name}
                    fullWidth
                    variant="outlined"
                  />
                }
                name="title"
                rules={{ required: true }}
                control={control}
                defaultValue={storeViews.provider.name}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                Logo Url
              </label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    fullWidth
                    variant="outlined"
                  />
                }
                name="logoUrl"
                control={control}
                defaultValue={storeViews.provider.logoUrl}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                Website
              </label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    fullWidth
                    variant="outlined"
                  />
                }
                name="website"
                rules={{ required: true }}
                control={control}
                defaultValue={storeViews.provider.website}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                Minimum Allocated Balance
              </label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    error={!!errors.minAllocatedBalance}
                    fullWidth
                    variant="outlined"
                  />
                }
                name="minAllocatedBalance"
                rules={{ required: true }}
                control={control}
                defaultValue={storeViews.provider.minAllocatedBalance}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className="customLabel">Merchant ID</label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    error={!!errors.merchantId}
                    fullWidth
                    variant="outlined"
                  />
                }
                name="merchantId"
                rules={{ required: true }}
                control={control}
                defaultValue={storeViews.provider.internalPaymentInfo.merchantId}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className="customLabel">Price in USD</label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    error={!!errors.price}
                    fullWidth
                    variant="outlined"
                  />
                }
                name="price"
                rules={{ required: true }}
                control={control}
                defaultValue={storeViews.provider.internalPaymentInfo.price}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className="customLabel">IPN Secret</label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    error={!!errors.ipnSecret}
                    fullWidth
                    variant="outlined"
                  />
                }
                name="ipnSecret"
                rules={{ required: true }}
                control={control}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className="customLabel">Trial</label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    error={!!errors.trial}
                    fullWidth
                    variant="outlined"
                  />
                }
                name="trial"
                rules={{ required: true }}
                control={control}
                defaultValue={storeViews.provider.internalPaymentInfo.trial}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className="customLabel">Exchanges</label>
              <FormControl className="selectInput" variant="outlined">
                <Select
                  className="select"
                  value={selectedExchange.id}
                  onChange={handleExchangeChange}
                >
                  {exchanges.map(
                    (item, index) =>
                      item.enabled && (
                        <MenuItem key={index} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ),
                  )}
                </Select>
              </FormControl>
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className="customLabel">Exchange Type</label>
              <FormControl className="selectInput" variant="outlined">
                <Select
                  className="select"
                  value={selectedExchangeType}
                  onChange={handleExchangeTypeChange}
                >
                  {selectedExchange.id &&
                    selectedExchange.type.map((item, index) => (
                      <MenuItem key={index} value={item.toLowerCase()}>
                        {item}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className="customLabel">Quotes</label>
              <FormControl className="selectInput" variant="outlined">
                <Select className="select" value={selectedQuote} onChange={handleQuoteChange}>
                  {Object.values(quotes).length &&
                    Object.values(quotes).map((item, index) => (
                      <MenuItem key={index} value={item.quote.toLowerCase()}>
                        {item.quote}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              className="inputBox switches"
              width="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                Make it Public
                <Tooltip
                  title="If you check this option, everybody with the provider url will be able to connect to your service."
                  placement="top"
                >
                  <HelpIcon className="icon" />
                </Tooltip>
              </label>
              <Controller
                as={<Switch />}
                name="public"
                control={control}
                defaultValue={storeViews.provider.public}
              />
            </Box>

            <Box
              className="inputBox switches"
              width="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                Get listed in the Marketplace.
                <Tooltip
                  title="Checking this option will list your service in the marketplace."
                  placement="top"
                >
                  <HelpIcon className="icon" />
                </Tooltip>
              </label>
              <Controller
                as={<Switch />}
                name="list"
                control={control}
                defaultValue={storeViews.provider.list}
              />
            </Box>
          </Box>

          <Box className="formAction" display="flex" flexDirection="row" justifyContent="flex-end">
            <CustomButton
              className={"full submitButton"}
              loading={loading}
              onClick={handleSubmitClick}
              type="submit"
            >
              Save Data
            </CustomButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default CopyTraderEditProfileForm;
