const initialState = {
  user: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TEST_DATA":
      return state;
    default:
      return state;
  }
};
