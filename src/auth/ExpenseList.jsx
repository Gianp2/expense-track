import { motion } from "framer-motion";

export default function ExpenseList({ items }) {
  if (!items.length) return <p className="text-center mt-6">No hay registros.</p>;

  return (
    <div className="max-w-md mx-auto mt-6 space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className={`flex justify-between p-3 rounded shadow ${
            item.type === "gasto" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div>
            <p className="font-semibold">{item.category} ({item.type})</p>
            <p className="text-sm">{item.description || "-"}</p>
            <p className="text-xs text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
          </div>
          <div className="text-lg font-bold">
            {item.amount.toLocaleString(undefined, { style: "currency", currency: item.currency })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}