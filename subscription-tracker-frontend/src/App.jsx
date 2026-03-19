import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Users from "./pages/Users";
import Subscriptions from "./pages/Subscriptions";
import Payments from "./pages/Payments";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

function AppInner() {
  const location = useLocation();
  return (
    <>
      {/* NavBar should NOT show on login page */}
      {location.pathname !== "/login" && <Navbar />}
      <div className="container mt-4">
        <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
export default App;
