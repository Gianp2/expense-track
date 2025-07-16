import { Routes, Route, Navigate, Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./auth/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* ✅ Toaster global */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1F2937",
            color: "#fff",
          },
          success: {
            style: { background: "#10B981" },
          },
          error: {
            style: { background: "#EF4444" },
          },
        }}
      />

      {/* ✅ Navegación */}
      <nav className="p-4 bg-white dark:bg-gray-800 shadow flex justify-between items-center flex-wrap">
        <h1 className="text-xl font-bold">💰 ExpenseTrack</h1>
        <div className="space-x-4 mt-2 md:mt-0 flex items-center">
          {!user ? (
            <>
              <Link to="/login" className="hover:underline flex items-center gap-1">
                <FaSignInAlt /> Login
              </Link>
              <Link to="/register" className="hover:underline flex items-center gap-1">
                <FaUserPlus /> Registro
              </Link>
            </>
          ) : (
            <>
              <span className="font-medium flex items-center gap-2">
                <FaUserCircle /> {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-red-700 transition"
              >
                <FaSignOutAlt /> Salir
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ✅ Rutas */}
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<h2 className="p-8 text-center text-xl">404 - Página no encontrada</h2>} />
      </Routes>
    </div>
  );
}

export default App;
