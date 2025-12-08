import { mockBrandMetrics } from "@/data/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandsRanking() {
  return (
    <div className="rounded-xl border border-border bg-card animate-fade-in">
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-semibold text-foreground">Top Marcas Detectadas</h3>
        <p className="text-sm text-muted-foreground">
          Ranking por número de aparições em fotos
        </p>
      </div>

      <div className="divide-y divide-border">
        {mockBrandMetrics.slice(0, 5).map((brand, index) => (
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

            {/* Logo placeholder */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground font-bold">
              {brand.logo}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {brand.brand}
              </h4>
              <p className="text-xs text-muted-foreground">{brand.category}</p>
            </div>

            {/* Stats */}
            <div className="text-right">
              <p className="font-semibold text-foreground">
                {brand.appearances.toLocaleString("pt-BR")}
              </p>
              <div className="flex items-center justify-end gap-1">
                {brand.growthPercent >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    brand.growthPercent >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {brand.growthPercent >= 0 ? "+" : ""}
                  {brand.growthPercent}%
                </span>
              </div>
            </div>

            {/* Market share bar */}
            <div className="w-20">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${brand.marketShare}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right mt-1">
                {brand.marketShare}%
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
