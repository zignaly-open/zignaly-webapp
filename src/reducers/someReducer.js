const TEST_ACTION = 'TEST_ACTION';

const someReducer = (state = { }, action) => {
  switch (action.type) {
    case TEST_ACTION:
      return state;
    default:
      return state;
  }
};

export default someReducer;
