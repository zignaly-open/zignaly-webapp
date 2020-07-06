// import React from "react";
// import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
// import { FormattedMessage } from "react-intl";
// import { useDispatch } from "react-redux";
// import { toggleBalanceBox } from "../../../store/actions/settings";
// import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
// import ThemeSwitcher from "../../ThemeSwitcher";
// import "./ProfileSettings.scss";
// import CustomButton from "../../CustomButton";
// import tradeApi from "../../../services/tradeApiClient";
// import { showErrorAlert, showSuccessAlert } from "../../../store/actions/ui";
// import { useForm, Controller } from "react-hook-form";

// const ProfileSettings = () => {
//   const dispatch = useDispatch();
//   const storeSettings = useStoreSettingsSelector();
//   const { handleSubmit, register, reset, control, errors } = useForm();
//   const storeSession = useStoreSessionSelector();

//   /**
//    * @typedef {Object} FormData
//    * @property {string} email
//    */

//   /**
//    * Function to submit form.
//    *
//    * @param {FormData} data Form data.
//    * @returns {void}
//    */
//   const submitForm = (data) => {
//     const payload = {
//       token: storeSession.tradeApi.accessToken,
//     };

//     setUpdating(true);

//     tradeApi
//       .updateProfileNotifications(payload)
//       .then((data) => {
//         dispatch(showSuccessAlert("Success", "accounts.settings.saved"));
//       })
//       .catch((e) => {
//         dispatch(showErrorAlert(e));
//       })
//       .finally(() => {
//         setUpdating(false);
//       });
//   };

//   return (
//     <form onSubmit={handleSubmit(submitForm)}>
//       <Box
//         alignItems="flex-start"
//         className="profileSettings"
//         display="flex"
//         flexDirection="column"
//       ></Box>
//     </form>
//   );
// };

// export default ProfileSettings;
