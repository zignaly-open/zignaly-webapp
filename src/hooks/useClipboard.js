import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../store/actions/ui";

/**
 * Copy content to clipboard and show alert.
 * @param {string} content
 * @param {string} successMessage
 */
const useClipboard = (content, successMessage) => {
  const dispatch = useDispatch();

  const copyToClipboard = () =>
    navigator.clipboard
      .writeText(content)
      .then(() => {
        dispatch(showSuccessAlert("", successMessage));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });

  return copyToClipboard;
};

export default useClipboard;
