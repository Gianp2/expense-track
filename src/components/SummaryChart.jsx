import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#EF4444", "#10B981"]; // rojo para gastos, verde para ingresos

export default function SummaryChart({ expenses }) {
  const totalGastos = expenses
    .filter(e => e.type === "gasto")
    .reduce((acc, cur) => acc + cur.amount, 0);

  const totalIngresos = expenses
    .filter(e => e.type === "ingreso")
    .reduce((acc, cur) => acc + cur.amount, 0);

  const data = [
    { name: "Gastos", value: totalGastos },
    { name: "Ingresos", value: totalIngresos },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toFixed(2)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
