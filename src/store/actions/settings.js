const SELECT_LANGUAGE = 'SELECT_LANGUAGE_ACTION';
const SELECT_THEME = 'SELECT_THEME_ACTION';

export const changeTheme = (data) => {
    return {
        type: SELECT_THEME,
        payload: data
    }
}

export const changeLanguage = (data) => {
    return {
        type: SELECT_LANGUAGE,
        payload: data
    }
}