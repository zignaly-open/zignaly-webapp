import React from "react";
import { Box, OutlinedInput } from "@material-ui/core";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import "./CreateReply.scss";
import { useIntl } from "react-intl";

const CreateReply = () => {
  const storeUserData = useStoreUserData();
  const intl = useIntl();

  return (
    <Box className="createReply" display="flex" alignItems="center">
      <ProviderLogo defaultImage={ProfileIcon} size="32px" title="" url={storeUserData.imageUrl} />
      <OutlinedInput
        fullWidth={true}
        // inputRef={register({
        //   required: true,
        // })}
        placeholder={intl.formatMessage({ id: "wall.write.comment" })}
        name="reply"
      />
    </Box>
  );
};
export default CreateReply;
