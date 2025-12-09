import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  suffix?: string;
  className?: string;
}

export function KPICard({ title, value, change, icon: Icon, suffix, className }: KPICardProps) {
  const formattedValue = typeof value === "number" 
    ? value.toLocaleString("pt-BR") 
    : value;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:glow-sm animate-fade-in",
        className
      )}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{formattedValue}</span>
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
        
        {change !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            <span
              className={cn(
                "text-sm font-medium",
                change >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {change >= 0 ? "+" : ""}{change}%
            </span>
            <span className="text-xs text-muted-foreground">vs. mês anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}
