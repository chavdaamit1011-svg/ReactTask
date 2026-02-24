import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("isAuth") === "true";
  const userEmail = localStorage.getItem("userEmail");

  const logout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("userEmail");
    navigate("/login"); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/rooms">
          Hotelmanagement
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          {isAuth && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/rooms">
                  Rooms
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reserve">
                  Reserve
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reservations">
                  Reservations
                </Link>
              </li>
            </ul>
          )}

          <div className="d-flex align-items-center gap-2">
            {isAuth ? (
              <>
                <span className="text-light small d-none d-md-inline">
                  {userEmail}
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link className="btn btn-outline-light btn-sm" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}