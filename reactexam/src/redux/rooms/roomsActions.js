export const ROOMS_LOADING = "ROOMS_LOADING";
export const ROOMS_SUCCESS = "ROOMS_SUCCESS";
export const ROOMS_ERROR = "ROOMS_ERROR";

export const roomsLoading = () => ({ type: ROOMS_LOADING });
export const roomsSuccess = (rooms) => ({ type: ROOMS_SUCCESS, payload: rooms });
export const roomsError = (err) => ({ type: ROOMS_ERROR, payload: err });