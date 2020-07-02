import React, { useState, useRef } from "react";
import "./SignupForm.scss";
import { Box, TextField, Checkbox } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm } from "react-hook-form";
import Captcha from "../../Captcha";
import Passwords from "../../Passwords";

const SignupForm = () => {
  const [loading] = useState(false);
  const [, setCaptchaResponse] = useState("");
  const recaptchaRef = useRef(null);
  const formMethods = useForm();
  const { errors, handleSubmit, register, clearError } = formMethods;

  //   const onSubmit = () => {
  //     if (data.password && data.repeatPassword && data.password === data.repeatPassword) {
  //       showLoading(true)
  //       const params = {
  //           projectId: projectId,
  //           firstName: data.firstName,
  //           email: data.email,
  //           password: data.password,
  //           subscribe: data.subscribe,
  //           ref: this.state.ref || null,
  //           array: true,
  //           gRecaptchaResponse: "abracadabra"
  //       };
  //       //setCaptchaResponse('')
  //       this.props.dispatch(signup(params, this.hideLoader));
  //     } else {
  //       setPasswordDoNotMatch(true);
  //     }
  //   };

  const onSubmit = () => {};

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
            error={!!errors.name}
            fullWidth
            inputRef={register({ required: true, minLength: 3 })}
            name="name"
            type="text"
            variant="outlined"
          />
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
        </Box>

        <Passwords formMethods={formMethods} />

        <Box className="inputBox checkbox">
          <Box alignItems="start" display="flex" flexDirection="row" justifyContent="start">
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
          <Box alignItems="start" display="flex" flexDirection="row" justifyContent="start">
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
