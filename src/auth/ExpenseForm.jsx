import { useState } from "react";
<<<<<<< HEAD
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
=======

export default function ExpenseForm({ onAdd, expenseCategories, incomeCategories, monedas }) {
  const [type, setType] = useState("gasto");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [currency, setCurrency] = useState("ARS");
  const [description, setDescription] = useState("");
>>>>>>> 347c1d0324f243c21b47056b32a2ce30ddb9d001

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!form.description || form.amount <= 0 || !form.category) {
      toast.error("Completa todos los campos");
=======
    if (!amount || !category || !date || !currency) {
      alert("Por favor, completá todos los campos");
>>>>>>> 347c1d0324f243c21b47056b32a2ce30ddb9d001
      return;
    }

    onAdd({
<<<<<<< HEAD
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
=======
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
>>>>>>> 347c1d0324f243c21b47056b32a2ce30ddb9d001
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