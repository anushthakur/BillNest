import { Link, useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();
    const user = localStorage.getItem("user");

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/dashboard">BillNest</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/users">Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/subscriptions">Subscriptions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/payments">Payments</Link>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center">
                        {user ? (
                            <>
                                <span className="text-light me-3">Welcome, {user}</span>
                                <button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <Link className="btn btn-sm btn-outline-light" to="/login">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;