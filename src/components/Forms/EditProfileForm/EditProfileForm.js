import React, { useState } from "react";
import "./EditProfileForm.scss";
import { Box, TextField, Typography, Switch, Tooltip } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import CountrySelect from "./CountrySelect";
import HelpIcon from "@material-ui/icons/Help";
import SocialSelect from "./SocialSelect";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { setProvider } from "../../../store/actions/views";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";
import UploadImage from "../../UploadImage";
import { showSuccessAlert, showErrorAlert } from "../../../store/actions/ui";
import breaks from "remark-breaks";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */

const CopyTraderEditProfileForm = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const storeUserData = useStoreUserData();
  const { errors, handleSubmit, control, setError, watch } = useForm();
  const [about, setAbout] = useState(provider.about);
  const [strategy, setStrategy] = useState(provider.strategy);
  const [selectedCountires, setSelectedCountries] = useState(provider.team);
  const [selectedSocials, setSelectedSocials] = useState(provider.social);
  const [socialError, setSocialError] = useState(false);
  const [logoUrl, setLogoUrl] = useState(provider.logoUrl);
  const dispatch = useDispatch();
  // @ts-ignore
  const [aboutTab, setAboutTab] = useState("write");
  // @ts-ignore
  const [strategyTab, setStrategyTab] = useState("write");

  const howToSendSignalsUrl = "https://docs.zignaly.com/signals/how-to";
  const listSwitch = watch("list", provider.list);
  const baseURL = process.env.GATSBY_TRADEAPI_URL;
  const signalUrl = `${baseURL}/signals.php?key=${provider.key}`;

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
  const onSubmit = (data) => {
    if (validatePaymentFields(data)) {
      setLoading(true);
      if (data.ipnSecret === "**********") {
        data.ipnSecret = "";
      }
      const payload = {
        ...data,
        social: prepareSocialData(),
        team: prepareTeamData(),
        about: about,
        strategy: strategy,
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        logoUrl,
      };
      tradeApi
        .providerEdit(payload)
        .then(() => {
          const payload2 = {
            token: payload.token,
            providerId: payload.providerId,
            version: 2,
          };
          dispatch(setProvider(payload2));
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
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleSubmitClick = () => {
    handleSubmit(onSubmit);
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

  const disableList = () => {
    if (!storeUserData.isAdmin) {
      if (listSwitch) {
        return false;
      }
      return true;
    }
    return false;
  };

  /**
   * @param {string} url Logo url.
   * @returns {void}
   */
  const handleLogoChange = (url) => {
    setLogoUrl(url);
  };

  return (
    <Box bgcolor="grid.content" className="formWrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          alignItems="flex-start"
          className="editProfileForm"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="flex-start"
        >
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
              <FormattedMessage id="srv.find" />
            </Typography>
            <SocialSelect
              defaultValue={provider.social}
              onChange={handleSocialLinkChange}
              onError={handleSocialError}
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
                  pattern: /^([a-zA-Z0-9 ()$_-]+)$/,
                }}
              />
              {errors.name && (
                <span className="errorText">
                  Name is reuired of max 50 characters. (Allowed characters, Numbers, Letters,
                  $,-,_)
                </span>
              )}
            </Box>

            <Box className="inputBox" display="flex" flexDirection="column">
              <label className="customLabel">
                <FormattedMessage id="srv.edit.logo" />
              </label>
              <UploadImage imageUrl={logoUrl} onChange={handleLogoChange} />
            </Box>

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

            {provider.isCopyTrading && (
              <Box className="inputBox" display="flex" flexDirection="column">
                <label className="customLabel">
                  <FormattedMessage id="srv.edit.minbalance" />
                </label>
                <Controller
                  as={
                    <TextField
                      className={
                        "customInput " +
                        (storeSettings.darkStyle ? " dark " : " light ") +
                        (errors.minAllocatedBalance ? "error" : "")
                      }
                      error={!!errors.minAllocatedBalance}
                      fullWidth
                      type="number"
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={provider.minAllocatedBalance}
                  name="minAllocatedBalance"
                  rules={{ required: false }}
                />
              </Box>
            )}

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
                    Merchant ID is required and should only contains letetrs and numbers.
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

            <Box
              alignItems="center"
              className="inputBox switches"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              width="100%"
            >
              <label className="customLabel">
                <FormattedMessage id="srv.edit.public" />
                <Tooltip
                  placement="top"
                  title={
                    <Typography variant="h5">
                      <FormattedMessage id="srv.edit.public.tooltip" />
                    </Typography>
                  }
                >
                  <HelpIcon className="icon" />
                </Tooltip>
              </label>
              <Controller
                control={control}
                defaultValue={provider.public}
                name="public"
                render={({ onChange, value }) => (
                  <Switch checked={value} onChange={(e) => onChange(e.target.checked)} />
                )}
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
              <label className="customLabel">
                <FormattedMessage id="srv.edit.list" />
                <Tooltip
                  placement="top"
                  title={
                    <Typography variant="h5">
                      <FormattedMessage id="srv.edit.list.tooltip" />
                    </Typography>
                  }
                >
                  <HelpIcon className="icon" />
                </Tooltip>
              </label>
              <Controller
                control={control}
                defaultValue={provider.list}
                name="list"
                render={({ onChange, onBlur, value }) => (
                  <Switch
                    checked={value}
                    disabled={disableList()}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
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
              <FormattedMessage id="action.saveData" />
            </CustomButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default CopyTraderEditProfileForm;
