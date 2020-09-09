import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import GFMDataProcessor from "@ckeditor/ckeditor5-markdown-gfm/src/gfmdataprocessor";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import Mention from "@ckeditor/ckeditor5-mention/src/mention";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";

const Markdown = (editor) => {
  editor.data.processor = new GFMDataProcessor(editor.editing.view.document);
};

/**
 * @typedef {import('react').MouseEventHandler} MouseEventHandler
 * @typedef {import('react').ButtonHTMLAttributes<HTMLButtonElement>} ButtonHTMLAttributes
 * @typedef {import('@material-ui/core').ButtonProps} ButtonProps
 */

/**
 * Default properties.
 *
 * @typedef {Object} DefaultProps
 * @property {Boolean} [loading] change button to loading state.
 * @property {String} [className] classname to apply styles.
 * @property {Object} children could be string or some node.
 * @property {MouseEventHandler} [onClick] handle onClick event.
 * @property {Boolean} [disabled] disable button and all events.
 * @property {ButtonHTMLAttributes["type"]} [type] type can be "submit" in terms of form.
 * @property {String} [target] open a link in a new tab.
 * @property {JSX.Element|string} [component] the component used for the root node.
 */

/**
 * Default component's props.
 *
 * @param {DefaultProps & ButtonProps} props
 */

const Editor = ({ content, onChange }) => {
  const editorConfiguration = {
    plugins: [
      Essentials,
      Autoformat,
      Bold,
      Italic,
      Underline,
      BlockQuote,
      EasyImage,
      Heading,
      Image,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      Link,
      List,
      MediaEmbed,
      Markdown,
      Mention,
      Paragraph,
      SimpleUploadAdapter,
      Table,
      TableToolbar,
      TextTransformation,
    ],
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "imageUpload",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
      ],
    },
    image: {
      toolbar: ["imageStyle:full", "imageStyle:side", "|", "imageTextAlternative"],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };

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
    <CKEditor
      editor={ClassicEditor}
      // data="<p>Hello from CKEditor 5!</p>"
      //   data="This is **bold**."
      data={content}
      config={editorConfiguration}
      onInit={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log("Editor is ready to use!", editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
        onChange(data);
      }}
      onBlur={(event, editor) => {
        console.log("Blur.", editor);
      }}
      onFocus={(event, editor) => {
        console.log("Focus.", editor);
      }}
    />
  );
};

export default Editor;
