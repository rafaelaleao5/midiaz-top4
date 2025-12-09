import { useEvents, useEventBrands, type FilterParams } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";
import type { BrandSummary } from "@/services/api/events";
import { useMemo } from "react";

// Marcas permitidas no banco
const ALLOWED_BRANDS = ['Nike', 'Adidas', 'Mizuno', 'Track&Field', 'Asics', 'Olympikus'];

interface BrandsRankingProps {
  filters?: FilterParams;
}

export function BrandsRanking({ filters }: BrandsRankingProps) {
  const { data: eventsData, isLoading: eventsLoading } = useEvents(10, 0, filters);
  const events = eventsData?.events || [];

  // Buscar marcas de todos os eventos (limitado aos primeiros 5 para performance)
  const eventIds = events.slice(0, 5).map(e => e.id);
  
  // Agregar marcas de todos os eventos
  const aggregatedBrands = useMemo(() => {
    if (events.length === 0) return [];

    const brandMap = new Map<string, { total_items: number; total_persons: number; events_count: number }>();

    // Por enquanto, vamos usar apenas o primeiro evento para simplificar
    // TODO: Implementar agregação de múltiplos eventos quando necessário
    if (eventIds.length > 0) {
      // Retornar estrutura que permite buscar marcas depois
      return eventIds;
    }

    return [];
  }, [eventIds]);

  // Buscar marcas do primeiro evento como exemplo
  const firstEventId = events.length > 0 ? events[0].id : null;
  const { data: brandsData, isLoading: brandsLoading } = useEventBrands(firstEventId);

  const isLoading = eventsLoading || brandsLoading;

  // Filtrar e ordenar marcas
  const brands = useMemo(() => {
    if (!brandsData?.brands) return [];

    return brandsData.brands
      .filter((b: BrandSummary) => ALLOWED_BRANDS.includes(b.brand))
      .sort((a: BrandSummary, b: BrandSummary) => b.total_items - a.total_items)
      .slice(0, 5);
  }, [brandsData]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">Carregando marcas...</div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-center text-muted-foreground">Nenhuma marca encontrada</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card animate-fade-in">
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-semibold text-foreground">Top Marcas Detectadas</h3>
        <p className="text-sm text-muted-foreground">
          Ranking por número de aparições (evento: {events[0]?.event_name || 'N/A'})
        </p>
      </div>

      <div className="divide-y divide-border">
        {brands.map((brand: BrandSummary, index: number) => (
          <div
            key={brand.brand}
            className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
          >
            {/* Rank */}
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm",
                index === 0 && "bg-chart-4/20 text-chart-4",
                index === 1 && "bg-muted text-muted-foreground",
                index === 2 && "bg-warning/20 text-warning",
                index > 2 && "bg-muted/50 text-muted-foreground"
              )}
            >
              {index + 1}
            </div>

            {/* Logo placeholder - usando primeira letra da marca */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground font-bold">
              {brand.brand.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {brand.brand}
              </h4>
              {/* Removido: category (não disponível no banco) */}
            </div>

            {/* Stats */}
            <div className="text-right">
              <p className="font-semibold text-foreground">
                {brand.total_items.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-muted-foreground">
                {brand.persons_with_brand} pessoas
              </p>
            </div>

            {/* Market share bar */}
            <div className="w-20">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${brand.brand_share_percent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right mt-1">
                {brand.brand_share_percent.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4">
        <button className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Ver todas as marcas →
        </button>
      </div>
    </div>
  );
}
