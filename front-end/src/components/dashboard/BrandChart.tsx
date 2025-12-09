import { mockTimeSeriesData } from "@/data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const brandColors = {
  nike: "hsl(187, 100%, 50%)",
  adidas: "hsl(262, 83%, 58%)",
  asics: "hsl(142, 76%, 36%)",
  mizuno: "hsl(38, 92%, 50%)",
};

export function BrandChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Presença de Marca ao Longo do Tempo
        </h3>
        <p className="text-sm text-muted-foreground">
          Aparições detectadas por mês (últimos 6 meses)
        </p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Nota: Dados temporais não disponíveis no banco atual. Componente aguardando integração com API.
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockTimeSeriesData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(222, 30%, 18%)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
              itemStyle={{ color: "hsl(210, 40%, 98%)" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span style={{ color: "hsl(215, 20%, 55%)", textTransform: "capitalize" }}>
                  {value}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="nike"
              stroke={brandColors.nike}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: brandColors.nike }}
            />
            <Line
              type="monotone"
              dataKey="adidas"
              stroke={brandColors.adidas}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: brandColors.adidas }}
            />
            <Line
              type="monotone"
              dataKey="asics"
              stroke={brandColors.asics}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: brandColors.asics }}
            />
            <Line
              type="monotone"
              dataKey="mizuno"
              stroke={brandColors.mizuno}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: brandColors.mizuno }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
