import React, { useState } from "react";
import "./UploadImage.scss";
import { Box } from "@mui/material";
import CustomButton from "../CustomButton/CustomButton";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import ProviderLogo from "../Provider/ProviderHeader/ProviderLogo";
import fetch from "cross-fetch";
import { showErrorAlert } from "../../store/actions/ui";

/**
 * @typedef {Object} UploadImagePropTypes
 * @property {string} imageUrl Current image.
 * @property {string} [defaultImage] Placeholder image.
 * @property {function(string): *} onChange Image change callback.
 */

/**
 * Component to upload image.
 *
 * @param {UploadImagePropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const UploadImage = ({ imageUrl, onChange, defaultImage }) => {
  const [modified, setModified] = useState(false);
  const [original] = useState(imageUrl);
  const dispatch = useDispatch();

  /**
   *
   * @param {React.ChangeEvent<*>} e Change event.
   * @returns {void}
   */
  const uploadLogo = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "xiammksy");
    const options = {
      method: "POST",
      body: formData,
    };

    fetch("https://api.cloudinary.com/v1_1/zignaly/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        onChange(res.secure_url);
        setModified(true);
      })
      .catch((err) => {
        dispatch(showErrorAlert(err));
      });
  };

  const handleDelete = () => {
    if (modified) {
      onChange(original);
    } else {
      // Set default image
      onChange("");
    }
    setModified(false);
  };

  // Handle no provider logo
  if (imageUrl === "images/providersLogo/default.png") {
    imageUrl = "";
  }

  return (
    <Box
      alignItems="center"
      className="uploadImage"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <ProviderLogo defaultImage={defaultImage} size="30px" title="Logo" url={imageUrl} />
      <Box display="flex" flexDirection="row">
        <input accept="image/*" className="logo" id="logo" onChange={uploadLogo} type="file" />
        <label htmlFor="logo">
          <CustomButton className="textPurple logoButton defaultText" component="span">
            <FormattedMessage id="srv.edit.upload" />
          </CustomButton>
        </label>
        <CustomButton className="deleteButton" disabled={!imageUrl} onClick={handleDelete}>
          <FormattedMessage id="srv.edit.delete" />
        </CustomButton>
      </Box>
    </Box>
  );
};

export default UploadImage;
