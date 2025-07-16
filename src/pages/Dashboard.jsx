import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ExpenseForm from "../auth/ExpenseForm";
import ExpenseList from "../auth/ExpenseList";
import SummaryChart from "../components/SummaryChart";
import { useAuth } from "../auth/AuthContext";
import { Toaster, toast } from "react-hot-toast";

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

export default function Dashboard() {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(`expenses_${user.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem(`budget_${user.email}`);
    return saved ? Number(saved) : 0;
  });

  const [budgetInput, setBudgetInput] = useState(budget);
  const [alertaMostrada, setAlertaMostrada] = useState(false);

  useEffect(() => {
    localStorage.setItem(`expenses_${user.email}`, JSON.stringify(expenses));
  }, [expenses, user.email]);

  useEffect(() => {
    localStorage.setItem(`budget_${user.email}`, budget.toString());
  }, [budget, user.email]);

  const gastoMesActual = expenses
    .filter(e => e.type === "gasto")
    .filter(e => {
      const fecha = new Date(e.date);
      const ahora = new Date();
      return (
        fecha.getMonth() === ahora.getMonth() &&
        fecha.getFullYear() === ahora.getFullYear()
      );
    })
    .reduce((acc, cur) => acc + cur.amount, 0);

  useEffect(() => {
    if (budget > 0 && gastoMesActual > budget && !alertaMostrada) {
      toast.error("🚨 ¡Presupuesto mensual superado!");
      setAlertaMostrada(true);
    }

    if (gastoMesActual <= budget && alertaMostrada) {
      setAlertaMostrada(false);
    }
  }, [gastoMesActual, budget, alertaMostrada]);

  const handleAddExpense = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const handleBudgetSave = () => {
    if (budgetInput <= 0) {
      toast.error("Ingresá un presupuesto válido");
      return;
    }
    
    setBudget(budgetInput);
    toast.success("Presupuesto guardado");
  };

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Toaster
        toastOptions={{
          style: {
            background: "#1F2937",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10B981",
            },
          },
          error: {
            style: {
              background: "#EF4444",
            },
          },
        }}
      />

      <motion.h2 variants={childVariants} className="text-3xl font-bold">
        Bienvenido, {user.name} ({user.role})
      </motion.h2>

      {/* Presupuesto mensual */}
      <motion.div
        variants={childVariants}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md mx-auto"
      >
        <h3 className="text-xl font-semibold mb-2">Presupuesto Mensual</h3>
        <input
          type="number"
          min="0"
          className="w-full p-2 border rounded mb-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          value={budgetInput}
          onChange={e => setBudgetInput(Number(e.target.value))}
          placeholder="Ej: 50000"
        />
        <button
          onClick={handleBudgetSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
        >
          Guardar Presupuesto
        </button>
        <p className="mt-2">
          Gasto total este mes:{" "}
          <strong className={gastoMesActual > budget ? "text-red-600" : ""}>
            {gastoMesActual.toLocaleString(undefined, {
              style: "currency",
              currency: expenses[0]?.currency || "ARS",
            })}
          </strong>
        </p>
        {budget > 0 && gastoMesActual > budget && (
          <p className="mt-2 text-red-700 font-bold">
            ⚠️ ¡Has superado tu presupuesto mensual!
          </p>
        )}
      </motion.div>

      <motion.div variants={childVariants}>
        <SummaryChart expenses={expenses} />
      </motion.div>
      <motion.div variants={childVariants}>
        <ExpenseForm onAdd={handleAddExpense} />
      </motion.div>
      <motion.div variants={childVariants}>
        <ExpenseList items={expenses} />
      </motion.div>
    </motion.div>
  );
}
