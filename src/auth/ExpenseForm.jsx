import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ExpenseForm({ onAdd, categories, setCategories, monedas }) {
  const [form, setForm] = useState({
    description: "",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    type: "gasto",
    category: "",
    currency: monedas[0]?.code || "ARS",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || form.amount <= 0 || !form.category || !form.date || !form.currency) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    onAdd({
      ...form,
      amount: Number(form.amount),
      id: crypto.randomUUID(),
    });

    setForm({
      description: "",
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      type: "gasto",
      category: "",
      currency: monedas[0]?.code || "ARS",
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
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Agregar Movimiento</h3>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">Descripción</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">Monto</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Ej: 1000"
          min="0"
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">Fecha</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">Tipo</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
        >
          <option value="gasto">Gasto</option>
          <option value="ingreso">Ingreso</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">Moneda</label>
        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
        >
          <option value="">Seleccionar moneda</option>
          {monedas.map((moneda) => (
            <option key={moneda.code} value={moneda.code}>
              {moneda.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-gray-700 dark:text-gray-300">Categoría</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-6"
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