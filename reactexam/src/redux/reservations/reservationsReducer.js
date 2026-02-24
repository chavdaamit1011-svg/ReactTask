import { RES_LOADING, RES_SUCCESS, RES_ERROR } from "./reservationsActions";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function reservationsReducer(state = initialState, action) {
  switch (action.type) {
    case RES_LOADING:
      return { ...state, loading: true, error: null };

    case RES_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case RES_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state; 
  }
}