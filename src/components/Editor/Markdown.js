// @ts-ignore
import GFMDataProcessor from "@ckeditor/ckeditor5-markdown-gfm/src/gfmdataprocessor";

// @ts-ignore
const Markdown = (editor) => {
  editor.data.processor = new GFMDataProcessor(editor.editing.view.document);
};

export default Markdown;
