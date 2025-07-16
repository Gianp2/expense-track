import { useState } from "react";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTags,
  FaCoins,
  FaList,
  FaComment,
} from "react-icons/fa";

const monedas = [
  { code: "ARS", label: "Peso Argentino (ARS)" },
  { code: "USD", label: "Dólar Americano (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
];

const categorias = [
  "Alimentos",
  "Transporte",
  "Salud",
  "Educación",
  "Entretenimiento",
  "Servicios",
  "Otros",
];

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    type: "gasto", // "gasto" o "ingreso"
    amount: "",
    category: categorias[0],
    currency: monedas[0].code,
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    onAdd({
      ...form,
      amount: Number(form.amount),
      id: Date.now(),
    });

    setForm({
      ...form,
      amount: "",
      description: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow space-y-4"
    >
      <div>
        <label className="block mb-1 font-semibold flex items-center gap-2">
          <FaList /> Tipo
        </label>
        <select
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="gasto">Gasto</option>
          <option value="ingreso">Ingreso</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold flex items-center gap-2">
          <FaMoneyBillWave /> Monto
        </label>
        <input
          type="number"
          step="0.01"
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="Ej: 1000.00"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold flex items-center gap-2">
          <FaTags /> Categoría
        </label>
        <select
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold flex items-center gap-2">
          <FaCoins /> Moneda
        </label>
        <select
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
        >
          {monedas.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold flex items-center gap-2">
          <FaCalendarAlt /> Fecha
        </label>
        <input
          type="date"
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold flex items-center gap-2">
          <FaComment /> Descripción (opcional)
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Ej: Compras en supermercado"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Agregar
      </button>
    </form>
  );
}
