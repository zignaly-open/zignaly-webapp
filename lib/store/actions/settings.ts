export const SELECT_LANGUAGE = "SELECT_LANGUAGE";
export const SELECT_THEME = "SELECT_THEME";
export const SET_SORT_COLUMN = "SET_SORT_COLUMN";
export const SET_SELECTED_EXCHANGE = "SET_SELECTED_EXCHANGE";
export const SET_SELECTED_SERVICE = "SET_SELECTED_SERVICE";
export const SET_ROWS_PER_PAGE = "SET_ROWS_PER_PAGE";
export const SET_HIDDEN_COLUMN = "SET_HIDDEN_COLUMN";

export const selectDarkTheme = (darkStyle) => {
  return {
    type: SELECT_THEME,
    payload: darkStyle,
  };
};

export const changeLanguage = (langCode) => {
  return {
    type: SELECT_LANGUAGE,
    payload: langCode,
  };
};

export const setSelectedExchange = (payload) => {
  return {
    type: SET_SELECTED_EXCHANGE,
    payload,
  };
};

export const setSelectedService = (payload) => {
  return {
    type: SET_SELECTED_SERVICE,
    payload,
  };
};

export const setSortColumn = (payload) => {
  return {
    type: SET_SORT_COLUMN,
    payload,
  };
};

export const setRowsPerPage = (payload) => {
  return {
    type: SET_ROWS_PER_PAGE,
    payload,
  };
};

export const setHiddenColumn = (payload) => {
  return {
    type: SET_HIDDEN_COLUMN,
    payload,
  };
};
