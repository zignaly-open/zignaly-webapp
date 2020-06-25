import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../store/actions/ui";

const useClipboard = () => {
  const dispatch = useDispatch();

  /**
   * Copy content to clipboard and show alert.
   * @param {string} content
   * @param {string} successMessage
   */
  const copyToClipboard = (content, successMessage) =>
    navigator.clipboard
      .writeText(content)
      .then(() => {
        dispatch(showSuccessAlert("Success", successMessage));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });

  return copyToClipboard;
};

export default useClipboard;
