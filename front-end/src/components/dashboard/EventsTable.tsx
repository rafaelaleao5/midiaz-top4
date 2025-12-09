import { useEvents } from "@/hooks/useEvents";
import { Calendar, MapPin, Camera, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/services/api/events";

const sportColors: Record<string, string> = {
  corrida: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  triathlon: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  ciclismo: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  vôlei: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  futebol: "bg-chart-5/20 text-chart-5 border-chart-5/30",
};

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

export function EventsTable() {
  const { data, isLoading, error } = useEvents(10, 0);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">Carregando eventos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-center text-destructive">
          Erro ao carregar eventos: {error.message}
        </div>
      </div>
    );
  }

  const events = data?.events || [];

  return (
    <div className="rounded-xl border border-border bg-card animate-fade-in">
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-semibold text-foreground">Eventos Recentes</h3>
        <p className="text-sm text-muted-foreground">
          Últimos eventos processados pela plataforma
        </p>
      </div>

      {events.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          Nenhum evento encontrado
        </div>
      ) : (
        <div className="divide-y divide-border">
          {events.map((event: Event) => (
          <div
            key={event.id}
            className="group p-4 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {event.event_name}
                  </h4>
                  <Badge
                    variant="outline"
                    className={sportColors[event.sport] || "bg-muted text-muted-foreground"}
                  >
                    {formatSportName(event.sport)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(event.event_date).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.event_location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Camera className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                      {(event.total_photos || 0).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">fotos</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                      {(event.total_athletes_estimated || 0).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">atletas</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      <div className="border-t border-border p-4">
        <button className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Ver todos os eventos →
        </button>
      </div>
    </div>
  );
}
