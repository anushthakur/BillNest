import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (email) {
            console.log("Logging in with email:", email);
            // store under the "user" key so ProtectedRoute, NavBar and redux can find it
            localStorage.setItem("user", email);
            navigate("/dashboard");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="card p-4" style={{ width: 420 }}>
                <h2 className="mb-3">Login</h2>
                <input className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default Login;