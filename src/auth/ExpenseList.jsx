import { motion } from "framer-motion";
import { BiTrash } from "react-icons/bi";

export default function ExpenseList({ items, onDelete }) {
  if (!items.length) return <p className="text-center mt-6">No hay registros.</p>;

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro que querés eliminar esta transacción?")) {
      onDelete(id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className={`flex justify-between items-center p-3 rounded shadow ${
            item.type === "gasto" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div>
            <p className="font-semibold">
              {item.category}
              {item.subcategory && ` > ${item.subcategory}`} ({item.type})
            </p>
            <p className="text-sm">{item.description || "-"}</p>
            <p className="text-xs text-gray-600">
              {new Date(item.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold whitespace-nowrap">
              {item.amount.toLocaleString(undefined, {
                style: "currency",
                currency: item.currency,
              })}
            </p>
            {onDelete && (
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:text-red-800 transition"
                title="Eliminar"
              >
                <BiTrash size={20} />
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
