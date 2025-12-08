import { mockEvents } from "@/data/mockData";
import { Calendar, MapPin, Camera, Users, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sportColors: Record<string, string> = {
  Corrida: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  Triathlon: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  Ciclismo: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  Natação: "bg-chart-4/20 text-chart-4 border-chart-4/30",
};

export function EventsTable() {
  return (
    <div className="rounded-xl border border-border bg-card animate-fade-in">
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-semibold text-foreground">Eventos Recentes</h3>
        <p className="text-sm text-muted-foreground">
          Últimos eventos processados pela plataforma
        </p>
      </div>

      <div className="divide-y divide-border">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className="group p-4 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {event.name}
                  </h4>
                  <Badge
                    variant="outline"
                    className={sportColors[event.sport] || "bg-muted text-muted-foreground"}
                  >
                    {event.sport}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(event.date).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Camera className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                      {event.photosAnalyzed.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">fotos</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                      {event.athletesDetected.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">atletas</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">{event.brandsDetected}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">marcas</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4">
        <button className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Ver todos os eventos →
        </button>
      </div>
    </div>
  );
}
