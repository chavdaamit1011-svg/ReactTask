import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReservation,
  fetchReservations,
  updateReservation,
} from "../redux/reservations/reservationsThunks";
import { fetchRooms } from "../redux/rooms/roomsThunks";
import { api } from "../redux/services/api";

export default function ReservationList() {
  const dispatch = useDispatch();

  const { data: reservations = [], loading, error } = useSelector(
    (s) => s.reservations
  );
  const { data: rooms = [] } = useSelector((s) => s.rooms);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    guestName: "",
    checkIn: "",
    checkOut: "",
    status: "confirmed",
  });

  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(fetchRooms());
  }, [dispatch]);

  const filtered = statusFilter === "ALL"
    ? reservations
    : reservations.filter(
        (r) =>
          (r.status || "confirmed").toLowerCase() === statusFilter
      );

  const getRoom = (id) => rooms.find((r) => r.id === id);

  const startEdit = (r) => {
    setEditId(r.id);
    setForm({
      guestName: r.guestName || "",
      checkIn: r.checkIn || "",
      checkOut: r.checkOut || "",
      status: r.status || "confirmed",
    });
  };

  const saveEdit = async (r) => {
    if (!form.guestName || !form.checkIn || !form.checkOut)
      return alert("All fields required!");

    if (new Date(form.checkOut) <= new Date(form.checkIn))
      return alert("Check-out must be after Check-in!");

    await dispatch(updateReservation(r.id, { ...r, ...form }));

    const room = getRoom(r.roomId);
    if (room) {
      await api.put(`/rooms/${room.id}`, {
        ...room,
        available: form.status === "cancelled",
      });
      dispatch(fetchRooms());
    }

    setEditId(null);
  };

  const remove = async (r) => {
    if (!window.confirm("Delete this reservation?")) return;

    await dispatch(deleteReservation(r.id));

    const room = getRoom(r.roomId);
    if (room) {
      await api.put(`/rooms/${room.id}`, {
        ...room,
        available: true,
      });
      dispatch(fetchRooms());
    }
  };

  if (loading) return <div className="alert alert-info">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h4>Reservations</h4>

      <select
        className="form-select mb-3"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="ALL">ALL</option>
        <option value="confirmed">confirmed</option>
        <option value="pending">pending</option>
        <option value="cancelled">cancelled</option>
      </select>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No reservations found
              </td>
            </tr>
          )}

          {filtered.map((r) => {
            const room = getRoom(r.roomId);
            const editing = editId === r.id;

            return (
              <tr key={r.id}>
                <td>{r.id}</td>

                <td>
                  {editing ? (
                    <input
                      className="form-control"
                      value={form.guestName}
                      onChange={(e) =>
                        setForm({ ...form, guestName: e.target.value })
                      }
                    />
                  ) : (
                    r.guestName
                  )}
                </td>

                <td>
                  {room
                    ? `#${room.roomNumber} (${room.type})`
                    : r.roomId}
                </td>

                <td>
                  {editing ? (
                    <>
                      <input
                        type="date"
                        value={form.checkIn}
                        onChange={(e) =>
                          setForm({ ...form, checkIn: e.target.value })
                        }
                      />
                      <input
                        type="date"
                        value={form.checkOut}
                        onChange={(e) =>
                          setForm({ ...form, checkOut: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    `${r.checkIn} → ${r.checkOut}`
                  )}
                </td>

                <td>
                  {editing ? (
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="confirmed">confirmed</option>
                      <option value="pending">pending</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  ) : (
                    r.status
                  )}
                </td>

                <td>
                  {editing ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => saveEdit(r)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditId(null)}
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => startEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => remove(r)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}