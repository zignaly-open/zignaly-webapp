import React, { useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel, OutlinedInput } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FillWhite from "../../../images/sidebar/fillWhite.svg";
import { useDispatch } from "react-redux";
import { selectDarkTheme, setShowBalance } from "../../../store/actions/settings";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import "./SecuritySettings.scss";
import { useForm } from "react-hook-form";
import Passwords from "../../Passwords";
import CustomButton from "../../CustomButton";
import EditIcon from "../../../images/ct/edit.svg";
import PasswordInput from "../../Passwords/PasswordInput";

const SecuritySettings = () => {
  const dispatch = useDispatch();
  const storeSettings = useStoreSettingsSelector();
  const formMethods = useForm();
  const { errors, handleSubmit, register, setError, clearError } = formMethods;
  const [editing, setEditing] = useState(false);

  const submitPassword = (data) => {
    console.log(data);

    // setEditing(false);
  };

  return (
    <Box className="securitySettings" display="flex" flexDirection="column" alignItems="flex-start">
      <form onSubmit={handleSubmit(submitPassword)}>
        <Box display="flex">
          <PasswordInput
            label={<FormattedMessage id={"security.password.current"} />}
            name="currentPassword"
            //   onChange={handleRepeatPasswordChange}
            inputRef={register({ required: true })}
            error={!!errors.password}
            disabled={!editing}
            placeholder={!editing ? "•••••••••" : ""}
          />
          {!editing && (
            <img
              onClick={() => setEditing(true)}
              src={EditIcon}
              title="Edit"
              aria-describedby="Edit password"
            />
          )}
        </Box>
        {editing && (
          <>
            <Passwords formMethods={formMethods} edit={true} />
            <CustomButton className="submitButton bold" type="submit">
              <FormattedMessage id="security.submit" />
            </CustomButton>
          </>
        )}
      </form>
    </Box>
  );
};

export default SecuritySettings;
