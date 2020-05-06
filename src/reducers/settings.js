const SELECT_LANGUAGE = 'SELECT_LANGUAGE_ACTION';
const SELECT_THEME = 'SELECT_THEME_ACTION';

const settings = (state = {}, action) => {
    switch (action.type) {
        case SELECT_LANGUAGE:
            state.language = action.payload;
            return {...state};
        case SELECT_THEME:
            state.darkStyle = action.payload;
            return {...state};
        default:
            return {...state};
    }
};

export default settings;
