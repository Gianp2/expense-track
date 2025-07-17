import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ExpenseForm({ onAdd, categories, setCategories, monedas }) {
  const [form, setForm] = useState({
    description: "",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    type: "gasto",
    category: "",
    currency: monedas[0]?.code || "ARS", // Inicializa con la primera moneda disponible
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || form.amount <= 0 || !form.category) {
      toast.error("Completa todos los campos");
      return;
    }

    onAdd({
      ...form,
      amount: Number(form.amount),
      id: crypto.randomUUID(),
    });

    setForm({
      ...form,
      description: "",
      amount: 0,
      category: "",
    });
    toast.success("Movimiento agregado");
  };

  const handleAddCategory = () => {
    const nueva = prompt("Nombre de la nueva categoría:");
    if (nueva && !categories.find((c) => c.name === nueva)) {
      setCategories([...categories, { name: nueva }]);
      toast.success(`Categoría "${nueva}" agregada`);
    } else if (nueva) {
      toast.error("La categoría ya existe");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4"
    >
      <h3 className="text-xl font-semibold">Agregar Movimiento</h3>

      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
      />

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Monto"
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
      >
        <option value="gasto">Gasto</option>
        <option value="ingreso">Ingreso</option>
      </select>

      {/* Moneda */}
      <select
        name="currency"
        value={form.currency}
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
      >
        <option value="">Seleccionar moneda</option>
        {monedas.map((moneda) => (
          <option key={moneda.code} value={moneda.code}>
            {moneda.label}
          </option>
        ))}
      </select>

      {/* Categoría */}
      <div className="flex items-center gap-2">
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          + Cat
        </button>
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
      >
        Agregar
      </button>
    </form>
  );
}