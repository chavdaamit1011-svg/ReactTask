import { api } from "../services/api";
import { roomsLoading, roomsSuccess, roomsError } from "./roomsActions";

export const fetchRooms = () => async (dispatch) => {
  try {
    dispatch(roomsLoading());
    const res = await api.get("/rooms");
    dispatch(roomsSuccess(res.data));
  } catch (e) {
    dispatch(roomsError(e.message));
  }
};