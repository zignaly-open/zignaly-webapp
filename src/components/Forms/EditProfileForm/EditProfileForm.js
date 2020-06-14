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
import SocialSelect from "./SocialSelect";

/**
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeListEntity} ExchangeListEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').QuoteAssetsDict} quotes
 * @property {Array<ExchangeListEntity>} exchanges
 */

/**
 * Copy trader profile edit component.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} Component JSX.
 */
const CopyTraderEditProfileForm = ({ quotes, exchanges }) => {
  const [loading, setLoading] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  const storeViews = useStoreViewsSelector();
  const { errors, handleSubmit, control } = useForm();
  const [about, setAbout] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [selectedCountires, setSelectedCountries] = useState([]);
  const [selectedSocials, setSelectedSocials] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState({ id: "", type: [] });
  const [selectedQuote, setSelectedQuote] = useState("");
  const [selectedExchangeType, setSelectedExchangeType] = useState("");

  const initEditorValues = () => {
    setAbout(RichTextEditor.createValueFromString(storeViews.provider.shortDesc, "html"));
    setStrategy(RichTextEditor.createValueFromString(storeViews.provider.longDesc, "html"));
  };

  useEffect(initEditorValues, []);

  useEffect(() => {
    let list = Object.values(quotes);
    if (list.length) {
      setSelectedQuote(storeViews.provider.copyTradingQuote.toLowerCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes]);

  useEffect(() => {
    if (exchanges.length) {
      let found = exchanges.find(
        (item) => item.name.toLowerCase() === storeViews.provider.exchanges[0].toLowerCase(),
      );
      if (found) {
        setSelectedExchange(found);
      }
    } else {
      setSelectedExchange({ id: "", type: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchanges]);

  useEffect(() => {
    if (exchanges.length && selectedExchange.id) {
      let found = exchanges.find((item) => item.id === selectedExchange.id);
      if (found) {
        if (found.name.toLowerCase() === storeViews.provider.exchanges[0].toLowerCase()) {
          setSelectedExchangeType(storeViews.provider.exchangeType);
        } else {
          setSelectedExchangeType(found.type[0]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExchange]);

  /**
   * Function to handle exchange changes.
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {void}
   */
  const handleExchangeChange = (e) => {
    let value = e.target.value;
    let found = exchanges.find((item) => item.id === value);
    if (found) {
      setSelectedExchange(found);
    }
  };

  /**
   * Function to handle exchange type changes.
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @return {void}
   */
  const handleExchangeTypeChange = (e) => {
    setSelectedExchangeType(e.target.value);
  };

  /**
   * Function to handle quote changes.
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {void}
   */
  const handleQuoteChange = (e) => {
    setSelectedQuote(e.target.value);
  };

  /**
   *
   * @typedef {Object} SubmitObject
   * @property {String} name
   * @property {String} logoUrl
   * @property {String} website
   * @property {String} minAllocatedBalance
   * @property {String} merchantId
   * @property {String} price
   * @property {String} ipnSecret
   * @property {String} trial
   * @property {boolean} public
   * @property {Boolean} list
   */

  /**
   * Function to submit edit form.
   *
   * @param {SubmitObject} data Form data received at submit.
   * @returns {Promise<*>} Returns promise.
   */
  const onSubmit = async (data) => {
    const params = {
      countries: selectedCountires,
      name: data.name,
      social: selectedSocials,
    };
    if (params.name) {
      setLoading(true);
    }
    try {
      setLoading(true);
    } catch (e) {
      alert(e.message);
    }
  };

  /**
   *
   * @param {*} list Array of selected countries received.
   * @returns {void} None.
   */
  const handleCountryChange = (list) => {
    setSelectedCountries(list);
  };

  /**
   *
   * @param {*} list Array of social object received.
   * @returns {void} None.
   */
  const handleSocialLinkChange = (list) => {
    setSelectedSocials(list);
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
   * @param {*} value Editor object received by the functions
   * @returns {void} None.
   */
  const handleAboutChange = (value) => {
    setAbout(value);
  };

  /**
   *
   * @param {*} value Editor object received by the functions
   * @returns {void} None.
   */
  const handleStrategyChange = (value) => {
    setStrategy(value);
  };

  return (
    <Box bgcolor="grid.main" className="formWrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          alignItems="flex-start"
          className="editProfileForm"
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
            <Typography variant="h3">
              <FormattedMessage id="srv.find" />
            </Typography>
            <SocialSelect onChange={handleSocialLinkChange} />
          </Box>

          <Box bgcolor="grid.main" className="strategyBox">
            <Typography variant="h3">
              <FormattedMessage id="srv.strategy" />
            </Typography>
            <RichTextEditor className="editor" onChange={handleStrategyChange} value={strategy} />
          </Box>

          <Box
            bgcolor="grid.main"
            className="profileBox"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
          >
            <Box className="inputBox" display="flex" flexDirection="column">
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                <FormattedMessage id="srv.edit.title" />
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
                control={control}
                defaultValue={storeViews.provider.name}
                name="title"
                rules={{ required: true }}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                <FormattedMessage id="srv.edit.logo" />
              </label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    fullWidth
                    variant="outlined"
                  />
                }
                control={control}
                defaultValue={storeViews.provider.logoUrl}
                name="logoUrl"
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                <FormattedMessage id="srv.edit.website" />
              </label>
              <Controller
                as={
                  <TextField
                    className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                    fullWidth
                    variant="outlined"
                  />
                }
                control={control}
                defaultValue={storeViews.provider.website}
                name="website"
                rules={{ required: true }}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                <FormattedMessage id="srv.edit.minbalance" />
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
                control={control}
                defaultValue={storeViews.provider.minAllocatedBalance}
                name="minAllocatedBalance"
                rules={{ required: true }}
              />
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className="customLabel">
                <FormattedMessage id="srv.edit.exchanges" />
              </label>
              <FormControl className="selectInput" variant="outlined">
                <Select
                  className="select"
                  onChange={handleExchangeChange}
                  value={selectedExchange.id}
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
              <label className="customLabel">
                <FormattedMessage id="srv.edit.exchangetype" />
              </label>
              <FormControl className="selectInput" variant="outlined">
                <Select
                  className="select"
                  onChange={handleExchangeTypeChange}
                  value={selectedExchangeType}
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
              <label className="customLabel">
                <FormattedMessage id="srv.edit.quotes" />
              </label>
              <FormControl className="selectInput" variant="outlined">
                <Select className="select" onChange={handleQuoteChange} value={selectedQuote}>
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
              className="paymentBox"
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <a
                className="paymentDocsLink"
                href="https://docs.zignaly.com/providers/how-to-create-a-public-provider#our-payment-system"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FormattedMessage id="srv.payment.docs" />
              </a>
              <Box className="inputBox" display="flex" flexDirection="column">
                <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                  <FormattedMessage id="srv.edit.merchantid" />
                </label>
                <Controller
                  as={
                    <TextField
                      className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                      error={!!errors.merchantId}
                      fullWidth
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={storeViews.provider.internalPaymentInfo.merchantId}
                  name="merchantId"
                  rules={{ required: true }}
                />
              </Box>

              <Box className="inputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="srv.edit.price" />
                </label>
                <Controller
                  as={
                    <TextField
                      className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                      error={!!errors.price}
                      fullWidth
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={storeViews.provider.internalPaymentInfo.price}
                  name="price"
                  rules={{ required: true }}
                />
              </Box>

              <Box className="inputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="srv.edit.ipn" />
                </label>
                <Controller
                  as={
                    <TextField
                      className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                      error={!!errors.ipnSecret}
                      fullWidth
                      variant="outlined"
                    />
                  }
                  control={control}
                  name="ipnSecret"
                  rules={{ required: true }}
                />
              </Box>

              <Box className="inputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="srv.edit.trial" />
                </label>
                <Controller
                  as={
                    <TextField
                      className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                      error={!!errors.trial}
                      fullWidth
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={storeViews.provider.internalPaymentInfo.trial}
                  name="trial"
                  rules={{ required: true }}
                />
              </Box>
            </Box>

            <Box
              alignItems="center"
              className="inputBox switches"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              width="100%"
            >
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                <FormattedMessage id="srv.edit.public" />
                <Tooltip
                  placement="top"
                  title="If you check this option, everybody with the provider url will be able to connect to your service."
                >
                  <HelpIcon className="icon" />
                </Tooltip>
              </label>
              <Controller
                as={<Switch />}
                control={control}
                defaultValue={storeViews.provider.public}
                name="public"
              />
            </Box>

            <Box
              alignItems="center"
              className="inputBox switches"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              width="100%"
            >
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                <FormattedMessage id="srv.edit.list" />
                <Tooltip
                  placement="top"
                  title="Checking this option will list your service in the marketplace."
                >
                  <HelpIcon className="icon" />
                </Tooltip>
              </label>
              <Controller
                as={<Switch />}
                control={control}
                defaultValue={storeViews.provider.list}
                name="list"
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
