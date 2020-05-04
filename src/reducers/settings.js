const SELECT_LANGUAGE = 'SELECT_LANGUAGE_ACTION';

const settings = (state = {}, action) => {
    switch (action.type) {
        case SELECT_LANGUAGE:
            state.action = action.languageCode;
            return state;
        default:
            return state;
    }
};

export default settings;
