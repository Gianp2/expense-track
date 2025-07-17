import { Routes, Route, Navigate, Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./auth/AuthContext";
import { Toaster } from "react-hot-toast";

// Animaciones para el título
const titleVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Toaster global */}
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

      {/* Navegación mejorada */}
      <nav className="p-4 bg-white dark:bg-gray-800 shadow flex justify-between items-center flex-wrap">
        <Link to={user ? "/dashboard" : "/"} aria-label="ExpenseTrack - Volver al inicio">
          <motion.div
            className="flex items-center gap-2"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            {/* Logo eliminado */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
              Expense Track
            </h1>
          </motion.div>
        </Link>
        <div className="space-x-4 mt-2 md:mt-0 flex items-center">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hover:underline flex items-center gap-1 text-gray-600 dark:text-gray-300"
              >
                <FaSignInAlt /> Login
              </Link>
              <Link
                to="/register"
                className="hover:underline flex items-center gap-1 text-gray-600 dark:text-gray-300"
              >
                <FaUserPlus /> Registro
              </Link>
            </>
          ) : (
            <>
              <span className="font-medium flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FaUserCircle /> {user.name} ({user.role})
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-red-700 transition"
                aria-label="Cerrar sesión"
              >
                <FaSignOutAlt /> Salir
              </motion.button>
            </>
          )}
        </div>
      </nav>

      {/* Rutas */}
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
