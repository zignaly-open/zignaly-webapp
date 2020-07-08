import React, { useState, useRef } from "react";
import "./SignupForm.scss";
import { Box, TextField, Checkbox } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import Captcha from "../../Captcha";
import Passwords from "../../Passwords";
import { projectId } from "../../../utils/defaultConfigs";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../store/actions/session";

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [gRecaptchaResponse, setCaptchaResponse] = useState("");
  const [ref] = useState("");
  const recaptchaRef = useRef(null);
  const formMethods = useForm();
  const { errors, handleSubmit, register, clearError, setError } = formMethods;
  const dispatch = useDispatch();

  /**
   *
   * @typedef {Object} DataObject
   * @property {String} password
   * @property {String} repeatPassword
   * @property {String} firstName
   * @property {String} email
   * @property {Boolean} subscribe
   * @property {Boolean} terms
   */

  /**
   *
   * @param {DataObject} data Data object received byt submitting the form.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    if (data.password === data.repeatPassword) {
      setLoading(true);
      const payload = {
        projectId: projectId,
        firstName: data.firstName,
        email: data.email,
        password: data.password,
        subscribe: data.subscribe,
        ref: ref,
        array: true,
        gRecaptchaResponse: gRecaptchaResponse,
        terms: data.terms,
      };
      dispatch(registerUser(payload, setLoading));
    } else {
      setError("repeatPassword", "Passwords do not match!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="signupForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Name</label>
          <TextField
            className="customInput"
            error={!!errors.firstName}
            fullWidth
            inputRef={register({ required: true, minLength: 3 })}
            name="firstName"
            type="text"
            variant="outlined"
          />
          {errors.firstName && errors.firstName.type === "required" && (
            <span className="errorText">Name is required!</span>
          )}
          {errors.firstName && errors.firstName.type === "minLength" && (
            <span className="errorText">Name should be greater than 3 letters!</span>
          )}
        </Box>
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">Email address</label>
          <TextField
            className="customInput"
            error={!!errors.email}
            fullWidth
            inputRef={register({
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
            })}
            name="email"
            type="email"
            variant="outlined"
          />
          {errors.email && errors.email.type === "required" && (
            <span className="errorText">Email is required!</span>
          )}
          {errors.email && errors.email.type === "pattern" && (
            <span className="errorText">Email should be valid!</span>
          )}
        </Box>

        <Passwords edit={false} formMethods={formMethods} />

        <Box className="inputBox checkbox">
          <Box alignItems="center" display="flex" flexDirection="row" justifyContent="start">
            <Checkbox
              className="checkboxInput"
              // error={errors.terms ? "true" : "false"}
              inputRef={register({ required: true })}
              name="terms"
              onChange={() => clearError("terms")}
            />
            <Box
              className={"terms-box " + (errors.terms ? " error" : "")}
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="start"
            >
              <span className="text">I agree to</span>
              <a className="link" href={"/legal/terms"}>
                Terms and condition
              </a>
              <span className="text">and</span>
              <a className="link" href={"/legal/privacy"}>
                privacy policy
              </a>
            </Box>
          </Box>
        </Box>

        <Box className="inputBox checkbox">
          <Box alignItems="center" display="flex" flexDirection="row" justifyContent="start">
            <Checkbox className="checkboxInput" inputRef={register} name="subscribe" />
            <span className={"terms-text"}>Subscribe to notifications</span>
          </Box>
        </Box>

        <Box className="captchaBox">
          <Captcha onChange={setCaptchaResponse} recaptchaRef={recaptchaRef} />
        </Box>

        <Box className="inputBox button-box">
          <CustomButton className={"full submitButton"} loading={loading} type="submit">
            Register
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default SignupForm;
