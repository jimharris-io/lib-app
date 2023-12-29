import * as actionTypes from "./actions";

const initialState = {
  loading: false,
  showModal: false,
  modalContents: {},
  modalResolve: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ERROR_MESSAGE:
      return {
        ...state,
        showModal: true,
        modalContents: {
          title: `Error ${action.title}`,
          body: <pre>{action.error.toString().replace("projects/", "/").replace(/: /g, `:\n`).replace(/\/(?=[^/]*$)/, '\/\n')}</pre>,
          reject: "Cancel",
          resolve: "Throw"
        },
        modalResolve: {
          callback: () => {
            throw(action.error);
          }
        }
      };
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        showModal: false,
        modalResolve: null
      };
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        showModal: true,
        modalContents: action.contents,
        modalResolve: action.resolve
      };
    case actionTypes.SHOW_LOADING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.HIDE_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
