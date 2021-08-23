import React, { useState, useEffect, useCallback } from "react";
import "./EditProfileForm.scss";
import { Box, TextField, Typography, Tooltip, Checkbox, FormHelperText } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CustomSelect from "components/CustomSelect";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import CountrySelect from "./CountrySelect";
import SocialSelect from "./SocialSelect";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { getProvider } from "../../../store/actions/views";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";
import UploadImage from "../../UploadImage";
import { showSuccessAlert, showErrorAlert } from "../../../store/actions/ui";
import breaks from "remark-breaks";
import ProviderDeleteButton from "../../Provider/ProviderHeader/ProviderDeleteButton";
import userOptions from "../../../utils/userOptions.json";
import { howToSendSignalsUrl, howToGetMerchantIDUrl } from "../../../utils/affiliateURLs";
import { formatFloat } from "utils/format";
import initialState from "store/initialState";
import Modal from "../../Modal";
import MarketplaceCacheMessage from "./MarketplaceCacheMessage";
import { setMarketplaceCacheModal } from "store/actions/settings";
import useSelectedExchange from "hooks/useSelectedExchange";
import CustomNumberInput from "../CustomNumberInput";

/**
 * @typedef {import("../../../services/tradeApiClient.types").DefaultProviderOptions} DefaultProviderOptions
 * @typedef {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */

const CopyTraderEditProfileForm = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  const [paymentBoxAlert, setPaymentBoxAlert] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  const selectedExchange = useSelectedExchange();
  const storeSession = useStoreSessionSelector();
  const storeUserData = useStoreUserData();
  const { errors, handleSubmit, control, register, setError } = useForm();
  const [about, setAbout] = useState(provider.about);
  const [strategy, setStrategy] = useState(provider.strategy);
  const [selectedCountires, setSelectedCountries] = useState(provider.team);
  const [selectedSocials, setSelectedSocials] = useState(provider.social);
  const [minAllocatedBalance, setMinAllocatedBalance] = useState(provider.minAllocatedBalance);
  const [socialError, setSocialError] = useState(false);
  const [logoUrl, setLogoUrl] = useState(provider.logoUrl);
  const [positions, setPositions] = useState([]);
  const dispatch = useDispatch();
  const [aboutTab, setAboutTab] = useState("write");
  const [strategyTab, setStrategyTab] = useState("write");
  const baseURL = process.env.GATSBY_TRADEAPI_URL;
  const signalUrl = `${baseURL}/signals.php?key=${provider.key}`;
  const [cacheModal, showCacheModal] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState(null);
  const intl = useIntl();

  const TooltipMarketPlace = useCallback(() => {
    return (
      <Box display="flex" flexDirection="column">
        <Typography variant="h5">
          <FormattedMessage id="srv.edit.list.tooltip" />
        </Typography>
        <ul>
          <li>
            <FormattedMessage id="srv.edit.list.1.tooltip" />
          </li>
          <li>
            <FormattedMessage id="srv.edit.list.2.tooltip" />
          </li>
          <li>
            <FormattedMessage id="srv.edit.list.3.tooltip" />
          </li>
          <li>
            <FormattedMessage id="srv.edit.list.4.tooltip" />
          </li>
        </ul>
      </Box>
    );
  }, []);

  const privacyOptions = [
    {
      label: intl.formatMessage({ id: "srv.edit.privacy.unlisted" }),
      val: "unlisted",
      disabled: provider.privacy !== "unlisted",
    },
    {
      label: intl.formatMessage({ id: "srv.edit.privacy.listedProfile" }),
      val: "listed_profile",
      disabled: provider.privacy !== "unlisted",
    },
    {
      label: intl.formatMessage({ id: "srv.edit.privacy.listedMarketplace" }),
      val: "listed_marketplace",
      tooltip: <TooltipMarketPlace />,
      disabled: true,
    },
  ];
  const [privacy, setPrivacy] = useState(privacyOptions[0].val);

  const loadPositions = () => {
    if (provider.id && provider.isCopyTrading && !provider.profitSharing) {
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
      };
      tradeApi
        .providerManagementPositions(payload)
        .then((response) => {
          setPositions(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        });
    }
  };

  useEffect(loadPositions, [provider.id]);

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
   * @returns {void} None.
   */
  const updateData = (data) => {
    if (validatePaymentFields(data)) {
      if (data.ipnSecret === "**********") {
        if (formatFloat(provider.internalPaymentInfo.price) !== formatFloat(data.price)) {
          setPaymentBoxAlert(true);
          return;
        }
        data.ipnSecret = "";
      }
      setLoading(true);
      setPaymentBoxAlert(false);
      const payload = {
        ...data,
        social: prepareSocialData(),
        team: prepareTeamData(),
        about: about,
        strategy: strategy,
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        options: preparePayloadOptions(data),
        logoUrl,
      };
      tradeApi
        .providerEdit(payload)
        .then(() => {
          const payload2 = {
            token: payload.token,
            providerId: payload.providerId,
            version: 2,
            exchangeInternalId: selectedExchange.internalId,
          };
          dispatch(getProvider(payload2, true));
          dispatch(showSuccessAlert("alert.profileedit.title", "alert.profileedit.body"));
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const prepareSocialData = () => {
    let list = [];
    for (let a = 0; a < selectedSocials.length; a++) {
      let obj = { network: "", link: "" };
      if (selectedSocials[a].link) {
        obj.link = selectedSocials[a].link;
        obj.network = selectedSocials[a].network;
      }
      list.push(obj);
    }
    return list;
  };

  const prepareTeamData = () => {
    let list = [];
    for (let a = 0; a < selectedCountires.length; a++) {
      let obj = { name: "", countryCode: "" };
      if (selectedCountires[a].name) {
        obj.name = selectedCountires[a].name;
        obj.countryCode = selectedCountires[a].countryCode;
      }
      list.push(obj);
    }
    return list;
  };

  /**
   *
   * @param {*} data Submitted object.
   * @returns {DefaultProviderOptions} Provider options.
   */
  const preparePayloadOptions = (data) => {
    let options = initialState.views.provider.options;
    userOptions.forEach((item) => {
      // @ts-ignore
      options[item.id] = data[item.id];
      delete data[item.id];
    });
    return options;
  };

  /**
   * Function to submit edit form.
   *
   * @param {SubmitObject} data Form data received at submit.
   * @returns {Boolean} Flag to indicate if fields are validated or not.
   */
  const validatePaymentFields = (data) => {
    if (socialError) {
      return false;
    }

    if (data.merchantId) {
      let flag = true;
      if (!data.price) {
        setError("price", { type: "manual" });
        flag = false;
      }
      if (!data.ipnSecret) {
        setError("ipnSecret", { type: "manual" });
        flag = false;
      }
      return flag;
    }

    if (data.price) {
      let flag = true;
      if (!data.merchantId) {
        setError("merchantId", { type: "manual" });
        flag = false;
      }
      if (!data.ipnSecret) {
        setError("ipnSecret", { type: "manual" });
        flag = false;
      }
      return flag;
    }

    if (data.ipnSecret) {
      let flag = true;
      if (!data.merchantId) {
        setError("merchantId", { type: "manual" });
        flag = false;
      }
      if (!data.price) {
        setError("price", { type: "manual" });
        flag = false;
      }
      return flag;
    }
    return true;
  };

  /**
   * Handle submit buttton click.
   *
   * @param {*} data formData
   * @returns {void}
   */
  const onSubmit = (data) => {
    if (!storeSettings.disableCacheModal[storeUserData.userId]) {
      showCacheModal(true);
      setSubmittedFormData(data);
    } else {
      updateData(data);
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

  /**
   *
   * @param {*} value Error flag for social fields.
   * @returns {void} None.
   */
  const handleSocialError = (value) => {
    setSocialError(value);
  };

  /**
   * @param {string} url Logo url.
   * @returns {void}
   */
  const handleLogoChange = (url) => {
    setLogoUrl(url);
  };

  /**
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {Void} None.
   */
  const handleMinAllocatedChange = (e) => {
    let data = e.target.value;
    if (data.match(/^[0-9]\d*(?:[.,]\d{0,8})?$/) || data === "") {
      data = data.replace(",", ".");
      setMinAllocatedBalance(data);
    }
  };

  const checkIfCanBeDeleted = () => {
    if (storeUserData.isAdmin) {
      return true;
    }
    if (provider.profitSharing) {
      return false;
    }
    if (!provider.isCopyTrading) {
      return true;
    }
    if (!provider.public && !provider.list && provider.disable && positions.length === 0) {
      return true;
    }
    return false;
  };

  const handleCacheModalClose = () => {
    showCacheModal(false);
  };

  /**
   *
   * @param {Boolean} showAgain Whether to show cache modal again
   * @returns {void}
   */
  const onAcceptance = (showAgain) => {
    if (showAgain) {
      dispatch(setMarketplaceCacheModal(storeUserData.userId));
    }
    updateData(submittedFormData);
  };

  return (
    <Box bgcolor="grid.content" className="formWrapper">
      <Modal onClose={handleCacheModalClose} persist={false} size="small" state={cacheModal}>
        <MarketplaceCacheMessage onClose={handleCacheModalClose} onSuccess={onAcceptance} />
      </Modal>
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <Box
          alignItems="flex-start"
          className="editProfileForm"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="flex-start"
        >
          <Box className="leftColumn">
            <Box bgcolor="grid.content" className="aboutBox">
              <Typography variant="h3">
                <FormattedMessage id="srv.about" />
              </Typography>
              <ReactMde
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(<ReactMarkdown plugins={[breaks]} source={markdown} />)
                }
                onChange={handleAboutChange}
                onTabChange={setAboutTab}
                // @ts-ignore
                selectedTab={aboutTab}
                value={about}
              />
            </Box>
            <Box bgcolor="grid.content" className="strategyBox">
              <Typography variant="h3">
                <FormattedMessage id="srv.strategy" />
              </Typography>
              <ReactMde
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(<ReactMarkdown plugins={[breaks]} source={markdown} />)
                }
                onChange={handleStrategyChange}
                onTabChange={setStrategyTab}
                // @ts-ignore
                selectedTab={strategyTab}
                value={strategy}
              />
            </Box>
            {!provider.isCopyTrading && (
              <Box className="optionsBox" display="flex" flexDirection="column">
                <Typography variant="h3">
                  <FormattedMessage id="signalp.useroption.title" />
                </Typography>
                <Typography className="optionsSubtitle" variant="body1">
                  <FormattedMessage id="signalp.useroption.subtitle" />
                </Typography>
                {userOptions.map((o) => (
                  <Box
                    alignItems="center"
                    className="optionsFieldbox"
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-start"
                    key={o.id}
                    width="100%"
                  >
                    <Controller
                      control={control}
                      // @ts-ignore
                      defaultValue={provider.options[o.id] ? provider.options[o.id] : false}
                      name={o.id}
                      render={({ onChange, onBlur, value }) => (
                        <Checkbox
                          checked={value}
                          className="checkbox"
                          onBlur={onBlur}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      )}
                    />
                    <Tooltip placement="top" title={<FormattedMessage id={o.tooltip} />}>
                      <label className="customLabel">
                        <FormattedMessage id={o.label} />
                      </label>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box className="rightColumn">
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
              <CountrySelect defaultValue={provider.team} onChange={handleCountryChange} />
              <Typography variant="h3">
                <FormattedMessage id="srv.social" />
              </Typography>
              <SocialSelect
                defaultValue={provider.social}
                onChange={handleSocialLinkChange}
                onError={handleSocialError}
              />
            </Box>
            <Box
              bgcolor="grid.content"
              className="profileBox"
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Box
                alignItems="flex-start"
                className="signalBox"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
              >
                <Typography variant="h6">
                  <FormattedMessage id="srv.signalurl" />
                  <span className="signalUrl">{signalUrl}</span>
                </Typography>
                <a
                  className="howToUrl"
                  href={howToSendSignalsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  How to send signals?
                </a>
              </Box>
              {provider.privacy === "unlisted" && (
                <>
                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className={"customLabel"}>
                      <FormattedMessage id="srv.edit.title" />
                    </label>
                    <Controller
                      as={
                        <TextField
                          className={
                            "customInput " +
                            (storeSettings.darkStyle ? " dark " : " light ") +
                            (errors.name ? "error" : "")
                          }
                          error={!!errors.profitsShare}
                          fullWidth
                          variant="outlined"
                        />
                      }
                      control={control}
                      defaultValue={provider.name}
                      name="name"
                      rules={{
                        required: true,
                        maxLength: 50,
                        minLength: 5,
                      }}
                    />
                    {errors.name && (
                      <span className="errorText">
                        <FormattedMessage id="form.error.name.length" />
                      </span>
                    )}
                  </Box>
                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className="customLabel">
                      <FormattedMessage id="srv.edit.logo" />
                    </label>
                    <UploadImage imageUrl={logoUrl} onChange={handleLogoChange} />
                  </Box>
                </>
              )}
              <Box className="inputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="srv.edit.website" />
                </label>
                <Controller
                  as={
                    <TextField
                      className={
                        "customInput " +
                        (storeSettings.darkStyle ? " dark " : " light ") +
                        (errors.website ? "error" : "")
                      }
                      error={!!errors.website}
                      fullWidth
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={provider.website ? provider.website : ""}
                  name="website"
                  rules={{
                    required: false,
                    pattern: /^(ftp|http|https):\/\/[^ "]+$/,
                  }}
                />
                {errors.website && (
                  <span className="errorText">url should be valid. (eg: https://zignaly.com)</span>
                )}
              </Box>
              <Box className="inputBox" />
              {provider.isCopyTrading && !provider.profitSharing && (
                <Box className="inputBox" display="flex" flexDirection="column">
                  <label className="customLabel">
                    <FormattedMessage id="srv.edit.minbalance" />
                  </label>
                  <TextField
                    className={
                      "customInput " +
                      (storeSettings.darkStyle ? " dark " : " light ") +
                      (errors.minAllocatedBalance ? "error" : "")
                    }
                    error={!!errors.minAllocatedBalance}
                    fullWidth
                    inputRef={register({ required: true })}
                    name="minAllocatedBalance"
                    onChange={handleMinAllocatedChange}
                    type="text"
                    value={minAllocatedBalance}
                    variant="outlined"
                  />
                </Box>
              )}
              {provider.isCopyTrading && provider.profitSharing && (
                <>
                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className="customLabel">
                      <FormattedMessage id="copyt.profitsharing.percentage" />
                    </label>
                    <CustomNumberInput
                      control={control}
                      defaultValue={provider.profitsShare}
                      errors={errors}
                      name="profitsShare"
                      rules={{ required: true }}
                      suffix="%"
                    />
                  </Box>
                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className="customLabel">
                      <FormattedMessage id="copyt.profitsharing.maxDrawdown" />
                    </label>
                    <CustomNumberInput
                      control={control}
                      defaultValue={provider.maxDrawdown}
                      errors={errors}
                      name="maxDrawdown"
                      rules={{
                        validate: {
                          max: (val) =>
                            val <= 100 &&
                            (!provider.maxDrawdown ||
                              val <= provider.maxDrawdown ||
                              intl.formatMessage({
                                id: "copyt.profitsharing.maxDrawdown.max",
                              })),
                        },
                      }}
                      suffix="%"
                    />
                  </Box>
                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className="customLabel">
                      <FormattedMessage id="copyt.profitsharing.maxAllocatedBalance" />
                    </label>
                    <CustomNumberInput
                      control={control}
                      defaultValue={provider.maxAllocatedBalance}
                      errors={errors}
                      name="maxAllocatedBalance"
                      rules={{
                        validate: {
                          max: (val) =>
                            provider.verified ||
                            val <= 50000 ||
                            intl.formatMessage(
                              {
                                id: "srv.edit.maxAllocatedBalance.max",
                              },
                              { max: 50000 },
                            ),
                        },
                      }}
                      suffix={provider.copyTradingQuote}
                    />
                  </Box>
                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className="customLabel">
                      <FormattedMessage id="copyt.profitsharing.maxPositions" />
                    </label>
                    <CustomNumberInput
                      control={control}
                      defaultValue={provider.maxPositions}
                      errors={errors}
                      name="maxPositions"
                    />
                  </Box>
                </>
              )}
              {!provider.profitSharing && (
                <Box
                  className="paymentBox"
                  display="flex"
                  flexDirection="row"
                  flexWrap="wrap"
                  justifyContent="space-between"
                >
                  <a
                    className="paymentDocsLink"
                    href={howToGetMerchantIDUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FormattedMessage id="srv.payment.docs" />
                  </a>
                  {Boolean(paymentBoxAlert) && (
                    <Alert className="alert" severity="error">
                      <Typography variant="body1">
                        <FormattedMessage id="srv.edit.ipn.alert" />
                      </Typography>
                    </Alert>
                  )}
                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className="customLabel">
                      <FormattedMessage id="srv.edit.merchantid" />
                    </label>
                    <Controller
                      as={
                        <TextField
                          className={
                            "customInput " +
                            (storeSettings.darkStyle ? " dark " : " light ") +
                            (errors.merchantId ? "error" : "")
                          }
                          fullWidth
                          variant="outlined"
                        />
                      }
                      control={control}
                      defaultValue={
                        provider.internalPaymentInfo ? provider.internalPaymentInfo.merchantId : ""
                      }
                      name="merchantId"
                      rules={{
                        pattern: /^[0-9a-zA-Z]+$/,
                        maxLength: 50,
                      }}
                    />
                    {errors.merchantId && (
                      <span className="errorText">
                        <FormattedMessage id="srv.edit.merchantid.error" />
                      </span>
                    )}
                  </Box>

                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className="customLabel">
                      <FormattedMessage id="srv.edit.price" />
                    </label>
                    <Controller
                      as={
                        <TextField
                          className={
                            "customInput " +
                            (storeSettings.darkStyle ? " dark " : " light ") +
                            (errors.price ? "error" : "")
                          }
                          fullWidth
                          type="number"
                          variant="outlined"
                        />
                      }
                      control={control}
                      defaultValue={
                        provider.internalPaymentInfo ? provider.internalPaymentInfo.price : ""
                      }
                      name="price"
                      rules={{ required: false }}
                    />
                    {errors.price && <span className="errorText">Price is required.</span>}
                  </Box>

                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className="customLabel">
                      <FormattedMessage id="srv.edit.ipn" />
                    </label>
                    <Controller
                      as={
                        <TextField
                          className={
                            "customInput " +
                            (storeSettings.darkStyle ? " dark " : " light ") +
                            (errors.ipnSecret ? "error" : "")
                          }
                          fullWidth
                          variant="outlined"
                        />
                      }
                      control={control}
                      defaultValue={provider.internalPaymentInfo.merchantId ? "**********" : ""}
                      name="ipnSecret"
                      rules={{ maxLength: 50 }}
                    />
                    {errors.ipnSecret && <span className="errorText">IPN Secret is required.</span>}
                  </Box>

                  <Box className="inputBox" display="flex" flexDirection="column">
                    <label className="customLabel">
                      <FormattedMessage id="srv.edit.trial" />
                    </label>
                    <Controller
                      as={
                        <TextField
                          className={
                            "customInput " +
                            (storeSettings.darkStyle ? " dark " : " light ") +
                            (errors.trial ? "error" : "")
                          }
                          fullWidth
                          variant="outlined"
                        />
                      }
                      control={control}
                      defaultValue={
                        provider.internalPaymentInfo ? provider.internalPaymentInfo.trial : 0
                      }
                      name="trial"
                      rules={{ required: false }}
                    />
                  </Box>
                </Box>
              )}
              <Box className="inputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="srv.edit.privacy" />
                </label>
                <CustomSelect onChange={setPrivacy} options={privacyOptions} value={privacy} />
                {provider.privacy === "unlisted" && privacy !== "unlisted" && (
                  <FormHelperText>
                    <FormattedMessage id="srv.edit.privacy.definitive" />
                  </FormHelperText>
                )}
              </Box>
            </Box>
          </Box>

          <Box className="formAction" display="flex" flexDirection="row" justifyContent="flex-end">
            <ProviderDeleteButton disabled={!checkIfCanBeDeleted()} provider={provider} />

            <CustomButton className={"full submitButton"} loading={loading} type="submit">
              <FormattedMessage id="action.saveData" />
            </CustomButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default CopyTraderEditProfileForm;
