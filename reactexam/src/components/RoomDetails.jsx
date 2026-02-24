import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms } from "../redux/rooms/roomsThunks";
import { Link, useParams } from "react-router-dom";

export default function RoomDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data: rooms, loading, error } = useSelector((s) => s.rooms);

    useEffect(() => {

        if (!rooms || rooms.length === 0) dispatch(fetchRooms());
    }, [dispatch, rooms]);

    const room = useMemo(() => {
        return rooms.find((r) => String(r.id) === String(id));
    }, [rooms, id]);

    if (loading) return <div className="alert alert-info">Loading room...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!room) return <div className="alert alert-warning">Room not found.</div>;

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h4 className="mb-3">
                    Room #{room.roomNumber} - {room.type}
                </h4>

                <p className="mb-1">
                    <b>Price:</b> ₹{room.price}
                </p>

                <p className="mb-1">
                    <b>Availability:</b>{" "}
                    {room.available ? (
                        <span className="badge text-bg-success">Available</span>
                    ) : (
                        <span className="badge text-bg-danger">Booked</span>
                    )}
                </p>

                <p className="mb-3">
                    <b>Features:</b>{" "}
                    {Array.isArray(room.features) ? room.features.join(", ") : "-"}
                </p>

                <div className="d-flex gap-2">
                    <Link to="/rooms" className="btn btn-outline-secondary btn-sm">
                        Back
                    </Link>

                    <Link
                        to="/reserve"
                        className={`btn btn-primary btn-sm ${room.available ? "" : "disabled"}`}
                    >
                        Reserve This Room
                    </Link>
                </div>
            </div>

            <h1>ghfjhv</h1>
        </div>
    );
}