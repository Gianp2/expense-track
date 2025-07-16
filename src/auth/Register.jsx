import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = register(form.name, form.email, form.password, form.role);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="w-full p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Registrarse
        </button>
      </form>
    </div>
  );
}