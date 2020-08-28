import React, { useState } from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import { ConfirmDialog } from "../../../Dialogs";
import { navigate as navigateReach } from "@reach/router";
import { useStoreUserData } from "../../../../hooks/useStoreUserSelector";
import ProviderLogo from "../../../Provider/ProviderHeader/ProviderLogo";
import ProfileIcon from "../../../../images/header/profileIcon.svg";
import "./CreatePost.scss";
import CKEditor from "@ckeditor/ckeditor5-react";

// import ClassicEditor from "../../../../ckeditor5-build/ckeditor";
// import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
// import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
// import Heading from "@ckeditor/ckeditor5-heading/src/heading";
// import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
// import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";

const CreatePost = () => {
  const storeUserData = useStoreUserData();

  const createPost = () => {
    if (!storeUserData.userName) {
      setConfirmConfig((c) => ({ ...c, visible: true }));
    }
  };

  /**
   * @typedef {import("../../../Dialogs/ConfirmDialog/ConfirmDialog").ConfirmDialogConfig} ConfirmDialogConfig
   * @type {ConfirmDialogConfig}
   */
  const initConfirmConfig = {
    titleTranslationId: "wall.completeprofile.title",
    messageTranslationId: "wall.completeprofile.desc",
    visible: false,
  };

  const [confirmConfig, setConfirmConfig] = useState(initConfirmConfig);

  const navigateProfileSettings = () => {
    navigateReach("#settings-profile");
  };

//   const editorConfiguration = {
//     plugins: [Essentials, Bold, Italic, Heading, Paragraph],
//     toolbar: {
//       items: [
//         "heading",
//         "|",
//         "bold",
//         "italic",
//         // "underline",
//         // "link",
//         // "bulletedList",
//         // "numberedList",
//         // "|",
//         // "imageUpload",
//         // "blockQuote",
//         // "insertTable",
//         // "mediaEmbed",
//         // "undo",
//         // "redo",
//       ],
//     },
//     // image: {
//     //   toolbar: ["imageStyle:full", "imageStyle:side", "|", "imageTextAlternative"],
//     // },
//     // table: {
//     //   contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
//     // },
//     // This value must be kept in sync with the language defined in webpack.config.js.
//     language: "en",
//   };

//   const editorConfiguration0 = {
//     plugins: [Essentials, Bold, Italic, Paragraph],
//     toolbar: ["bold", "italic"],
//   };

  //   const config = {
  //     toolbar: [
  //       "heading",
  //       "|",
  //       "bold",
  //       "italic",
  //       "link",
  //       "bulletedList",
  //       "numberedList",
  //       "blockQuote",
  //     ],
  //     heading: {
  //       options: [
  //         { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
  //         { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
  //         { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
  //       ],
  //     },
  //   };
  return (
    <Paper className="createPost">
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={navigateProfileSettings}
        setConfirmConfig={setConfirmConfig}
      />
      <Typography variant="h3">
        <FormattedMessage id="wall.write" />
      </Typography>
      <ProviderLogo size="30px" title="" url={storeUserData.imageUrl} defaultImage={ProfileIcon} />

      <CKEditor
        editor={ClassicEditor}
        // data="<p>Hello from CKEditor 5!</p>"
        data="This is **bold**."
        // config={editorConfiguration}
        onInit={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />

      <CustomButton className="submitButton" onClick={() => createPost()}>
        <FormattedMessage id="wall.post" />
      </CustomButton>
    </Paper>
  );
};
export default CreatePost;
