import React from "react";
import { Box, Typography, OutlinedInput } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";
import "./ProfileSettings.scss";
import { IKImage, IKContext, IKUpload } from "imagekitio-react";

const ProfileSettings = () => {
  //   const dispatch = useDispatch();
  const storeUserData = useStoreUserData();
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

  const onError = (err) => {
    console.log("Error");
    console.log(err);
  };

  const onSuccess = (res) => {
    console.log("Success");
    console.log(res);
  };
  return (
    // <form onSubmit={handleSubmit(submitForm)}></form>
    <Box alignItems="flex-start" className="profileSettings" display="flex" flexDirection="column">
      <label className="inputBox">
        <Typography variant="body1">
          <FormattedMessage id="profile.userid" />
        </Typography>
        <Typography className="userId" variant="body1">
          {storeUserData.userId}
        </Typography>
      </label>
      <label className="inputBox">
        <Typography variant="body1">
          <FormattedMessage id="profile.email" />
        </Typography>
        <OutlinedInput className="customInput" disabled={true} value={storeUserData.email} />
      </label>
      <IKUpload
        fileName="my-upload"
        useUniqueFileName={false}
        onError={onError}
        onSuccess={onSuccess}
      />
    </Box>
    // </form>
  );
};

export default ProfileSettings;
