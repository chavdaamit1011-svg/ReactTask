import { ROOMS_LOADING, ROOMS_SUCCESS, ROOMS_ERROR } from "./roomsActions";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function roomsReducer(state = initialState, action) {
  switch (action.type) {
    case ROOMS_LOADING:
      return { ...state, loading: true, error: null };
    case ROOMS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
   
    default:
      return state;
  }
}