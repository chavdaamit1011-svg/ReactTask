import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms } from "../redux/rooms/roomsThunks";
import { Link } from "react-router-dom";

export default function RoomList() {
  const dispatch = useDispatch();
  const { data: rooms = [], loading, error } = useSelector((s) => s.rooms);

  const [typeFilter, setTypeFilter] = useState("ALL");
  const [availFilter, setAvailFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NONE");
 
  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const types = useMemo(() => {
    const set = new Set(rooms.map((r) => r.type));
    return ["ALL", ...Array.from(set)];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    let list = [...rooms];

    if (typeFilter !== "ALL") {
      list = list.filter((r) => r.type === typeFilter);
    }

    if (availFilter === "AVAILABLE") {
      list = list.filter((r) => r.available === true);
    } else if (availFilter === "NOT_AVAILABLE") {
      list = list.filter((r) => r.available === false);
    }

    if (sortBy === "PRICE_LOW") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "PRICE_HIGH") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [rooms, typeFilter, availFilter, sortBy]);

  if (loading) return <div className="alert alert-info">Loading rooms...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <div>
          <label className="form-label mb-1">Filter by Type</label>
          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label mb-1">Availability</label>
          <select
            className="form-select"
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
          >
            <option value="ALL">ALL</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="NOT_AVAILABLE">NOT AVAILABLE</option>
          </select>
        </div>

        <div>
          <label className="form-label mb-1">Sort by Price</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="NONE">NONE</option>
            <option value="PRICE_LOW">Low → High</option>
            <option value="PRICE_HIGH">High → Low</option>
          </select>
        </div>

        <div className="ms-auto">
          <span className="badge text-bg-dark">
            Total: {filteredRooms.length}
          </span>
        </div>
      </div>

      <div className="row g-3">
        {filteredRooms.map((r) => (
          <div key={r.id} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  Room #{r.roomNumber}{" "}
                  {r.available ? (
                    <span className="badge text-bg-success">Available</span>
                  ) : (
                    <span className="badge text-bg-danger">Booked</span>
                  )}
                </h5>

                <p className="mb-1">
                  <b>Type:</b> {r.type}
                </p>
                <p className="mb-1">
                  <b>Price:</b> ₹{r.price}
                </p>
                <p className="mb-2">
                  <b>Features:</b>{" "}
                  {Array.isArray(r.features)
                    ? r.features.join(", ")
                    : "-"}
                </p>

                <Link
                  to={`/rooms/${r.id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div className="col-12">
            <div className="alert alert-warning">No rooms found.</div>
          </div>
        )}
      </div>
    </div>
  );
}