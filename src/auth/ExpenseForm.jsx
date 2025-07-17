import { useState } from "react";

export default function ExpenseForm({ onAdd, expenseCategories, incomeCategories, monedas }) {
  const [type, setType] = useState("gasto");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [currency, setCurrency] = useState("ARS");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !date || !currency) {
      alert("Por favor, completá todos los campos");
      return;
    }

    onAdd({
      type,
      amount: Number(amount),
      category,
      date,
      currency,
      description,
      id: Date.now(),
    });

    setAmount("");
    setCategory("");
    setDate("");
    setCurrency("ARS");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Tipo</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="gasto">Gasto</option>
          <option value="ingreso">Ingreso</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Monto</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Ej: 1000"
          min="0"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Moneda</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">Seleccionar moneda</option>
          {monedas.map((moneda) => (
            <option key={moneda.code} value={moneda.code}>
              {moneda.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Categoría</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">Seleccionar</option>
          {(type === "gasto" ? expenseCategories : incomeCategories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Descripción</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Opcional"
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
