import { useBrandTimeSeries } from "@/hooks/useEvents";
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

const brandColors: Record<string, string> = {
  nike: "hsl(187, 100%, 50%)",
  adidas: "hsl(262, 83%, 58%)",
  asics: "hsl(142, 76%, 36%)",
  mizuno: "hsl(38, 92%, 50%)",
  trackfield: "hsl(340, 82%, 52%)",
  olympikus: "hsl(200, 70%, 50%)",
};

const brandDisplayNames: Record<string, string> = {
  nike: "Nike",
  adidas: "Adidas",
  asics: "Asics",
  mizuno: "Mizuno",
  trackfield: "Track&Field",
  olympikus: "Olympikus",
};

export function BrandChart() {
  const { data, isLoading, error } = useBrandTimeSeries();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Presença de Marca ao Longo do Tempo
          </h3>
          <p className="text-sm text-muted-foreground">
            Carregando dados...
          </p>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">Carregando gráfico...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Presença de Marca ao Longo do Tempo
          </h3>
          <p className="text-sm text-destructive">
            Erro ao carregar dados: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const chartData = data?.data || [];

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Presença de Marca ao Longo do Tempo
          </h3>
          <p className="text-sm text-muted-foreground">
            Nenhum dado disponível
          </p>
        </div>
      </div>
    );
  }

  // Detectar quais marcas estão presentes nos dados
  const availableBrands = Object.keys(brandColors).filter((brand) =>
    chartData.some((entry) => entry[brand] !== undefined && entry[brand] !== 0)
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Presença de Marca ao Longo do Tempo
        </h3>
        <p className="text-sm text-muted-foreground">
          Itens detectados por mês ({chartData.length} meses)
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
              tickFormatter={(value) => 
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString()
              }
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
              formatter={(value: number, name: string) => [
                value.toLocaleString("pt-BR"),
                brandDisplayNames[name] || name,
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span style={{ color: "hsl(215, 20%, 55%)" }}>
                  {brandDisplayNames[value] || value}
                </span>
              )}
            />
            {availableBrands.map((brand) => (
              <Line
                key={brand}
                type="monotone"
                dataKey={brand}
                stroke={brandColors[brand]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: brandColors[brand] }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
