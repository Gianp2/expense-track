    import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";

     const COLORS = ["#0088FE", "#00xaa00", "#FFBB28", "#FF8042", "#AA00AA"];

     export default function PieChart({ items }) {
       // Agrupar gastos por categoría
       const data = items
         .filter((item) => item.type === "gasto")
         .reduce((acc, item) => {
           const existing = acc.find((d) => d.name === item.category);
           if (existing) {
             existing.value += item.amount;
           } else {
             acc.push({ name: item.category, value: item.amount });
           }
           return acc;
         }, []);

       return (
         <div className="w-full h-64">
           <RechartsPieChart width={400} height={250}>
             <Pie
               data={data}
               dataKey="value"
               nameKey="name"
               cx="50%"
               cy="50%"
               outerRadius={80}
               fill="#8884d8"
               label
             >
               {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
               ))}
             </Pie>
             <Tooltip />
             <Legend />
           </RechartsPieChart>
         </div>
       );
     }