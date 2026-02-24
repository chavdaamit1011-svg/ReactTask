import { api } from "../services/api";
import { resLoading, resSuccess, resError } from "./reservationsActions";

export const fetchReservations = () => async (dispatch) => {
    try {
        dispatch(resLoading());
        const res = await api.get("/reservations");
        dispatch(resSuccess(res.data));
    } catch (e) {
        dispatch(resError(e?.message || "Failed to fetch reservations"));
    }
};

export const addReservation = (payload) => async (dispatch) => {
    try {
        dispatch(resLoading());
        await api.post("/reservations", payload);
        const res = await api.get("/reservations");
        dispatch(resSuccess(res.data));
    } catch (e) {
        dispatch(resError(e?.message || "Failed to add reservation"));
    }
};

export const updateReservation = (id, payload) => async (dispatch) => {
    try {
        dispatch(resLoading());
        await api.put(`/reservations/${id}`, payload);
        const res = await api.get("/reservations");
        dispatch(resSuccess(res.data));
    } catch (e) {
        dispatch(resError(e?.message || "Failed to update reservation"));
    }
};

export const deleteReservation = (id) => async (dispatch) => {
    try {
        dispatch(resLoading());
        await api.delete(`/reservations/${Number(id)}`);
        const res = await api.get("/reservations");
        dispatch(resSuccess(res.data));
    } catch (e) {
        dispatch(resError(e.message));
    }
};