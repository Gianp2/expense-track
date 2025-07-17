import { motion } from "framer-motion";
import { FaFilter } from "react-icons/fa";

export default function Sidebar({ filters, setFilters, categories, monedas, onClearFilters }) {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <motion.aside
      className="w-64 bg-white dark:bg-gray-800 p-6 shadow-md z-50 fixed top-0 left-0 h-screen lg:static lg:w-1/4" // Aumenté z-50 para prioridad
      initial={{ x: 0 }}
      animate={{ x: 0 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <FaFilter className="text-blue-600 dark:text-blue-400" size={24} />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Filtros</h3>
      </div>
      <div className="space-y-4">
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
        <button
          onClick={onClearFilters}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition focus:ring-2 focus:ring-red-500 font-medium"
        >
          Limpiar Filtros
        </button>
      </div>
    </motion.aside>
  );
}