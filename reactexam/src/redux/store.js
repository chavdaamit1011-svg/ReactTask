import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

import roomsReducer from "./rooms/roomsReducer";
import reservationsReducer from "./reservations/reservationsReducer";

const rootReducer = combineReducers({
  rooms: roomsReducer,
  reservations: reservationsReducer, 
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;