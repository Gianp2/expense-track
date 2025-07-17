import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import ExpenseForm from "../auth/ExpenseForm";
import ExpenseList from "../auth/ExpenseList";
import SummaryChart from "../components/SummaryChart";
import { useAuth } from "../auth/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { FaWallet, FaChartPie, FaList, FaUserCircle, FaFilter } from "react-icons/fa";

// Animaciones
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Monedas
const monedas = [
  { code: "ARS", label: "Peso Argentino (ARS)" },
  { code: "USD", label: "Dólar Americano (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
];

export default function Dashboard() {
  const { user } = useAuth();

  // Estado para categorías (sin subcategorías)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(`categories_${user.email}`);
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Comida" },
          { name: "Transporte" },
          { name: "Entretenimiento" },
        ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(`expenses_${user.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem(`budget_${user.email}`);
    return saved ? JSON.parse(saved) : { amount: 0, currency: "ARS" };
  });

  const [budgetInput, setBudgetInput] = useState(budget.amount);
  const [budgetCurrency, setBudgetCurrency] = useState(budget.currency);
  const [alertaMostrada, setAlertaMostrada] = useState(false);

  // Estado para filtros (sin subcategoría)
  const [filters, setFilters] = useState({
    tipo: "",
    categoria: "",
    desde: "",
    hasta: "",
    moneda: "",
  });

  // Guardar categorías en localStorage
  useEffect(() => {
    localStorage.setItem(`categories_${user.email}`, JSON.stringify(categories));
  }, [categories, user.email]);

  useEffect(() => {
    localStorage.setItem(`expenses_${user.email}`, JSON.stringify(expenses));
  }, [expenses, user.email]);

  useEffect(() => {
    localStorage.setItem(
      `budget_${user.email}`,
      JSON.stringify({ amount: budgetInput, currency: budgetCurrency })
    );
  }, [budgetInput, budgetCurrency, user.email]);

  // Cálculo de gastos e ingresos del mes actual por moneda
  const gastoMesActualPorMoneda = useMemo(() => {
    return expenses
      .filter((e) => e.type === "gasto")
      .filter((e) => {
        const fecha = new Date(e.date);
        const ahora = new Date();
        return (
          fecha.getMonth() === ahora.getMonth() &&
          fecha.getFullYear() === ahora.getFullYear()
        );
      })
      .reduce((acc, cur) => {
        acc[cur.currency] = (acc[cur.currency] || 0) + cur.amount;
        return acc;
      }, {});
  }, [expenses]);

  const ingresoMesActualPorMoneda = useMemo(() => {
    return expenses
      .filter((e) => e.type === "ingreso")
      .filter((e) => {
        const fecha = new Date(e.date);
        const ahora = new Date();
        return (
          fecha.getMonth() === ahora.getMonth() &&
          fecha.getFullYear() === ahora.getFullYear()
        );
      })
      .reduce((acc, cur) => {
        acc[cur.currency] = (acc[cur.currency] || 0) + cur.amount;
        return acc;
      }, {});
  }, [expenses]);

  // Resumen por categoría y moneda
  const gastosPorCategoriaYMoneda = useMemo(() => {
    return expenses
      .filter((e) => e.type === "gasto")
      .reduce((acc, curr) => {
        const key = `${curr.category}_${curr.currency}`;
        acc[key] = (acc[key] || 0) + curr.amount;
        return acc;
      }, {});
  }, [expenses]);

  const ingresosPorCategoriaYMoneda = useMemo(() => {
    return expenses
      .filter((e) => e.type === "ingreso")
      .reduce((acc, curr) => {
        const key = `${curr.category}_${curr.currency}`;
        acc[key] = (acc[key] || 0) + curr.amount;
        return acc;
      }, {});
  }, [expenses]);

  // Filtrar transacciones
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const fecha = new Date(expense.date);
      const desde = filters.desde ? new Date(filters.desde) : null;
      const hasta = filters.hasta ? new Date(filters.hasta) : null;

      return (
        (!filters.tipo || expense.type === filters.tipo) &&
        (!filters.categoria || expense.category === filters.categoria) &&
        (!filters.moneda || expense.currency === filters.moneda) &&
        (!desde || fecha >= desde) &&
        (!hasta || fecha <= hasta)
      );
    });
  }, [expenses, filters]);

  useEffect(() => {
    const gastoTotal = gastoMesActualPorMoneda[budgetCurrency] || 0;
    if (budget.amount > 0 && gastoTotal > budget.amount && !alertaMostrada) {
      toast.dismiss();
      toast.error(`🚨 ¡Presupuesto mensual superado en ${budgetCurrency}!`);
      setAlertaMostrada(true);
    }

    if (gastoTotal <= budget.amount && alertaMostrada) {
      setAlertaMostrada(false);
    }
  }, [gastoMesActualPorMoneda, budget, budgetCurrency, alertaMostrada]);

  const handleAddExpense = (expense) => {
    setExpenses((prev) => [{ ...expense, id: Date.now() }, ...prev]);
    toast.success("Transacción agregada");
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    toast.success("Registro eliminado");
  };

  const handleBudgetSave = () => {
    if (budgetInput <= 0) {
      toast.dismiss();
      toast.error("Ingresá un presupuesto válido");
      return;
    }

    toast.dismiss();
    setBudget({ amount: budgetInput, currency: budgetCurrency });
    toast.success("Presupuesto guardado");
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({
      tipo: "",
      categoria: "",
      desde: "",
      hasta: "",
      moneda: "",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <motion.div
      className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Encabezado centrado */}
      <motion.header
        variants={childVariants}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex justify-center items-center transition-all duration-300 hover:shadow-lg"
        role="banner"
      >
        <div className="flex flex-col items-center gap-4 text-center md:flex-row">
          <FaUserCircle className="text-4xl text-green-600 dark:text-green-400" aria-hidden="true" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
              {getGreeting()}, {user.name}!
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Gestioná tus finanzas de forma sencilla y efectiva
              <span className="text-gray-500 dark:text-gray-400"> ({user.role})</span>
            </p>
          </div>
        </div>
      </motion.header>

      {/* Presupuesto Mensual */}
      <motion.section
        variants={childVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaWallet className="text-green-600 dark:text-green-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Presupuesto Mensual</h3>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-300">Presupuesto Mensual</label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
                value={budgetInput}
                onChange={(e) => setBudgetInput(Number(e.target.value))}
                placeholder="Ej: 50000"
                aria-label="Ingresar presupuesto mensual"
              />
            </div>
            <div className="w-32">
              <label className="block text-gray-700 dark:text-gray-300">Moneda</label>
              <select
                value={budgetCurrency}
                onChange={(e) => setBudgetCurrency(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
              >
                {monedas.map((moneda) => (
                  <option key={moneda.code} value={moneda.code}>
                    {moneda.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleBudgetSave}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition focus:ring-2 focus:ring-green-500 font-medium"
          >
            Guardar Presupuesto
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300">Gasto total este mes:</p>
              {Object.entries(gastoMesActualPorMoneda).length ? (
                Object.entries(gastoMesActualPorMoneda).map(([currency, amount]) => (
                  <p
                    key={currency}
                    className={
                      amount > (budget.amount && currency === budgetCurrency)
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-800 dark:text-gray-100"
                    }
                  >
                    <strong>
                      {amount.toLocaleString(undefined, {
                        style: "currency",
                        currency,
                      })}
                    </strong>
                  </p>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No hay gastos</p>
              )}
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">Ingreso total este mes:</p>
              {Object.entries(ingresoMesActualPorMoneda).length ? (
                Object.entries(ingresoMesActualPorMoneda).map(([currency, amount]) => (
                  <p key={currency} className="text-gray-800 dark:text-gray-100">
                    <strong>
                      {amount.toLocaleString(undefined, {
                        style: "currency",
                        currency,
                      })}
                    </strong>
                  </p>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No hay ingresos</p>
              )}
            </div>
          </div>
          {budget.amount > 0 && (gastoMesActualPorMoneda[budgetCurrency] || 0) > budget.amount && (
            <p className="mt-4 text-red-600 dark:text-red-400 font-medium bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">
              ⚠️ ¡Has superado tu presupuesto mensual en {budgetCurrency}!
            </p>
          )}
        </div>
      </motion.section>

      {/* Filtros */}
      <motion.section
        variants={childVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-blue-600 dark:text-blue-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Tipo</label>
            <select
              name="tipo"
              value={filters.tipo}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="">Todos</option>
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Categoría</label>
            <select
              name="categoria"
              value={filters.categoria}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="">Todas</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Moneda</label>
            <select
              name="moneda"
              value={filters.moneda}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="">Todas</option>
              {monedas.map((moneda) => (
                <option key={moneda.code} value={moneda.code}>
                  {moneda.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Desde</label>
            <input
              type="date"
              name="desde"
              value={filters.desde}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Hasta</label>
            <input
              type="date"
              name="hasta"
              value={filters.hasta}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition focus:ring-2 focus:ring-red-500 font-medium"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </motion.section>

      {/* Resumen por Categoría */}
      <motion.section
        variants={childVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaChartPie className="text-blue-600 dark:text-blue-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Resumen por Categoría</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Gastos</h4>
            <ul className="space-y-2">
              {Object.entries(gastosPorCategoriaYMoneda).length ? (
                Object.entries(gastosPorCategoriaYMoneda).map(([key, amount]) => {
                  const [category, currency] = key.split("_");
                  return (
                    <li key={key} className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>{category}</span>
                      <span>
                        {amount.toLocaleString(undefined, {
                          style: "currency",
                          currency,
                        })}
                      </span>
                    </li>
                  );
                })
              ) : (
                <li className="text-gray-500 dark:text-gray-400">No hay gastos registrados</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Ingresos</h4>
            <ul className="space-y-2">
              {Object.entries(ingresosPorCategoriaYMoneda).length ? (
                Object.entries(ingresosPorCategoriaYMoneda).map(([key, amount]) => {
                  const [category, currency] = key.split("_");
                  return (
                    <li key={key} className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>{category}</span>
                      <span>
                        {amount.toLocaleString(undefined, {
                          style: "currency",
                          currency,
                        })}
                      </span>
                    </li>
                  );
                })
              ) : (
                <li className="text-gray-500 dark:text-gray-400">No hay ingresos registrados</li>
              )}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Gráfico de Resumen */}
      <motion.section
        variants={childVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaChartPie className="text-purple-600 dark:text-purple-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Análisis de Gastos</h3>
        </div>
        <SummaryChart expenses={filteredExpenses} />
      </motion.section>

      {/* Formulario de Transacciones */}
      <motion.section
        variants={childVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaList className="text-blue-600 dark:text-blue-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Nueva Transacción</h3>
        </div>
        <ExpenseForm
          onAdd={handleAddExpense}
          categories={categories}
          setCategories={setCategories}
          monedas={monedas}
        />
      </motion.section>

      {/* Lista de Transacciones */}
      <motion.section
        variants={childVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaList className="text-teal-600 dark:text-teal-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Transacciones</h3>
        </div>
        <ExpenseList
          items={filteredExpenses}
          onDelete={handleDeleteExpense}
          categories={categories}
        />
      </motion.section>
    </motion.div>
  );
}