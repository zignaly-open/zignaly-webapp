import React, { useState } from "react";
import "./UploadImage.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../CustomButton/CustomButton";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import ProviderLogo from "../Provider/ProviderHeader/ProviderLogo";
import fetch from "cross-fetch";
import { showErrorAlert } from "../../store/actions/ui";

/**
 * @typedef {import('react').ChangeEvent} ChangeEvent
 * @typedef {import('react').KeyboardEvent} KeyboardEvent
 */

const UploadImage = ({ imageUrl, onChange }) => {
  const [modified, setModified] = useState(false);
  const [original] = useState(imageUrl);
  const dispatch = useDispatch();

  /**
   *
   * @param {*} e Error flag for social fields.
   * @returns {void} None.
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
        dispatch(showErrorAlert(e));
      });
  };

  const handleDelete = () => {
    onChange(original);
    setModified(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      className="uploadImage"
      justifyContent="flex-start"
    >
      <ProviderLogo size="30px" url={imageUrl || imageUrl} />
      <Box display="flex" flexDirection="row">
        <input type="file" acceptt="image/*" onChange={uploadLogo} id="logo" />
        <label htmlFor="logo">
          <CustomButton className="textPurple logoButton defaultText" component="span">
            <FormattedMessage id="srv.edit.upload" />
          </CustomButton>
        </label>
        <CustomButton
          className="defaultText deleteButton"
          disabled={!modified}
          onClick={handleDelete}
        >
          <FormattedMessage id="srv.edit.delete" />
        </CustomButton>
      </Box>
    </Box>
  );
};

export default UploadImage;
