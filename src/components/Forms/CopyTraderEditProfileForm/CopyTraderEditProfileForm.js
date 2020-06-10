import React, { useState } from "react";
import "./CopyTraderEditProfileForm.scss";
import { Box, TextField, Typography } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import RichTextEditor from "react-rte";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import CountrySelect from "./CountrySelect";

const CopyTraderEditProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, register } = useForm();
  const [about, setAbout] = useState(RichTextEditor.createEmptyValue());
  const [strategy, setStrategy] = useState(RichTextEditor.createEmptyValue());
  const [selectedCountires, setselectedCountries] = useState([]);
  const storeSettings = useStoreSettingsSelector();

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
            bgcolor="grid.main"
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
            <Box
              alignItems="flex-start"
              className="inputBox"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
            >
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                Facebook Url
              </label>
              <TextField
                className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                error={!!errors.facebookUrl}
                fullWidth
                inputRef={register}
                name="facebookUrl"
                variant="outlined"
              />
            </Box>
            <Box
              alignItems="flex-start"
              className="inputBox"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
            >
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                Twitter Url
              </label>
              <TextField
                className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                error={!!errors.twitterUrl}
                fullWidth
                inputRef={register}
                name="twitterUrl"
                variant="outlined"
              />
            </Box>
            <Box
              alignItems="flex-start"
              className="inputBox"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
            >
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                Discord Url
              </label>
              <TextField
                className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                error={!!errors.discordUrl}
                fullWidth
                inputRef={register}
                name="discordUrl"
                variant="outlined"
              />
            </Box>
            <Box
              alignItems="flex-start"
              className="inputBox"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
            >
              <label className={"customLabel " + (storeSettings.darkStyle ? "dark" : "light")}>
                LinkedIn Url
              </label>
              <TextField
                className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                error={!!errors.linkedinUrl}
                fullWidth
                inputRef={register}
                name="linkedinUrl"
                variant="outlined"
              />
            </Box>
            <Box
              alignItems="flex-start"
              className="inputBox"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
            >
              <label className="customLabel">TTTT Url</label>
              <TextField
                className={"customInput " + (storeSettings.darkStyle ? "dark" : "light")}
                fullWidth
                inputRef={register}
                name="ttttUrl"
                variant="outlined"
              />
            </Box>
          </Box>
          <Box bgcolor="grid.main" className="strategyBox">
            <Typography variant="h3">
              <FormattedMessage id="srv.strategy" />
            </Typography>
            <RichTextEditor className="editor" onChange={handleStrategyChange} value={strategy} />
          </Box>
          <Box bgcolor="grid.main" className="performanceBox">
            <Typography variant="h3">
              <FormattedMessage id="srv.performanceoverview" />
            </Typography>
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
