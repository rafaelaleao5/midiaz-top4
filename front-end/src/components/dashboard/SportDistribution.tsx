import { useEvents } from "@/hooks/useEvents";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";
import type { Event } from "@/services/api/events";

const COLORS = [
  "hsl(187, 100%, 50%)",
  "hsl(262, 83%, 58%)",
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(215, 20%, 55%)",
];

const formatSportName = (sport: string): string => {
  const mapping: Record<string, string> = {
    corrida: "Corrida",
    triathlon: "Triathlon",
    ciclismo: "Ciclismo",
    vôlei: "Vôlei",
    futebol: "Futebol",
  };
  return mapping[sport] || sport;
};

interface SportData {
  sport: string;
  percentage: number;
  events: number;
}

export function SportDistribution() {
  const { data: eventsData, isLoading } = useEvents(100, 0);
  const events = eventsData?.events || [];

  // Calcular distribuição de esportes
  const sportDistribution = useMemo(() => {
    if (events.length === 0) return [];

    // Contar eventos por esporte
    const sportCount: Record<string, number> = {};
    events.forEach((event: Event) => {
      const sportType = event.sport;
      sportCount[sportType] = (sportCount[sportType] || 0) + 1;
    });

    // Converter para array e calcular porcentagens
    const total = events.length;
    const distribution: SportData[] = Object.entries(sportCount).map(
      ([sport, count]) => ({
        sport: formatSportName(sport),
        percentage: Math.round((count / total) * 100),
        events: count,
      })
    );

    // Ordenar por quantidade (maior para menor)
    return distribution.sort((a, b) => b.events - a.events);
  }, [events]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (sportDistribution.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">
          Nenhum evento encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Distribuição por Esporte
        </h3>
        <p className="text-sm text-muted-foreground">
          Eventos processados por modalidade
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sportDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="percentage"
              >
                {sportDistribution.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 8%)",
                  border: "1px solid hsl(222, 30%, 18%)",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value}%`, "Participação"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-3">
          {sportDistribution.map((item, index) => (
            <div key={item.sport} className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="flex-1 text-sm text-foreground">{item.sport}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
