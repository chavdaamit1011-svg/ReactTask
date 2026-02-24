export const RES_LOADING = "RES_LOADING";
export const RES_SUCCESS = "RES_SUCCESS";
export const RES_ERROR = "RES_ERROR";

export const resLoading = () => ({ type: RES_LOADING });
export const resSuccess = (data) => ({ type: RES_SUCCESS, payload: data });
export const resError = (err) => ({ type: RES_ERROR, payload: err });