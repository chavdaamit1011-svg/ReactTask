import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms } from "../redux/rooms/roomsThunks";
import {
    addReservation,
    fetchReservations,
} from "../redux/reservations/reservationsThunks";
import { api } from "../redux/services/api";
import { useNavigate } from "react-router-dom";

export default function ReservationForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: rooms } = useSelector((s) => s.rooms);
    const { data: reservations, loading } = useSelector((s) => s.reservations);

    const [roomId, setRoomId] = useState("");
    const [guestName, setguestname] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    useEffect(() => {
        dispatch(fetchRooms());
        dispatch(fetchReservations());
    }, [dispatch]);

    const availableRooms = useMemo(() => {
        return (rooms || []).filter((r) => r.available === true);
    }, [rooms]);

    const checking = (newIn, newOut, exIn, exOut) => {
        const A1 = new Date(newIn);
        const A2 = new Date(newOut);
        const B1 = new Date(exIn);
        const B2 = new Date(exOut);
        return A1 < B2 && A2 > B1;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!roomId || !guestName || !checkIn || !checkOut) {
            alert("All fields required!");
            return;
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            alert("Check-out must be after Check-in!");
            return;
        }

        const selectedRoom = (rooms || []).find(
            (r) => Number(r.id) === Number(roomId)
        );

        if (selectedRoom && selectedRoom.available === false) {
            alert("Room already booked. Select another.");
            return;
        }

        const conflict = (reservations || []).some((res) => {
            if (Number(res.roomId) !== Number(roomId)) return false;
            const status = String(res.status || "confirmed").toLowerCase();
            if (status === "cancelled") return false;
            return checking(checkIn, checkOut, res.checkIn, res.checkOut);
        });

        if (conflict) {
            alert("Room already booked for selected dates.");
            return;
        }

        const payload = {

            roomId: Number(roomId),
            guestName,
            checkIn,
            checkOut,
            status: "confirmed",
        };

        await dispatch(addReservation(payload));

        if (selectedRoom) {
            await api.put(`/rooms/${roomId}`, {
                ...selectedRoom,
                available: false,
            });
            dispatch(fetchRooms());
        }

        alert("Reservation successful");
        navigate("/reservations");
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card p-4 shadow-sm">
                    <h4 className="mb-3">Make Reservation</h4>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">
                                Select Room
                            </label>
                            <select
                                className="form-select"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                            >
                                <option value="">-- Select Room --</option>
                                {availableRooms.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        #{r.roomNumber} - {r.type} (₹{r.price})
                                    </option>
                                ))}
                            </select>

                            {availableRooms.length === 0 && (
                                <div className="text-danger small mt-1">
                                    No available rooms.
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Guest Name</label>
                            <input
                                className="form-control"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Check-In</label>
                            <input
                                type="date"
                                className="form-control"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Check-Out</label>
                            <input
                                type="date"
                                className="form-control"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading || availableRooms.length === 0}
                        >
                            {loading ? "Booking..." : "Book Now"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}