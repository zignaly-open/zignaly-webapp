import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../store/actions/ui";

const useClipboard = () => {
  const dispatch = useDispatch();

  /**
   * Copy content to clipboard and show alert.
   * @param {string} content Content to copy to the clipboard.
   * @param {string} successMessage Alert message.
   * @returns {void}
   */
  const copyToClipboard = (content, successMessage) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        dispatch(showSuccessAlert("Success", successMessage));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  return copyToClipboard;
};

export default useClipboard;
