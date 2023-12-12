import * as actionTypes from "./actions";

const initialState = {
  showAlert: false,
  alertVariant: "",
  alertContents: "",
  appKey: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_ALERT:
      return {
        ...state,
        showAlert: true,
        alertVariant: action.variant,
        alertContents: action.contents,
      };
    case actionTypes.DISMISS_ALERT:
      return {
        ...state,
        showAlert: false,
        alertVariant: "",
        alertContents: "",
      };
    case actionTypes.INIT_APP:
      return {
        ...state,
        appKey: action.appKey,
      };
    default:
      return state;
  }
};

export default reducer;
