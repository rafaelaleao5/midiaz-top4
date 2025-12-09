import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface DashboardFilters {
  sport?: string[];
  eventType?: string[];
  location?: string[];
  brand?: string[];
  dateFrom?: string;
  dateTo?: string;
}

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
}

const SPORTS = [
  { value: "corrida", label: "Corrida" },
  { value: "triathlon", label: "Triathlon" },
  { value: "ciclismo", label: "Ciclismo" },
  { value: "vôlei", label: "Vôlei" },
  { value: "futebol", label: "Futebol" },
];

const EVENT_TYPES = [
  { value: "prova", label: "Prova" },
  { value: "treino", label: "Treino" },
];

const BRANDS = [
  { value: "Nike", label: "Nike" },
  { value: "Adidas", label: "Adidas" },
  { value: "Mizuno", label: "Mizuno" },
  { value: "Track&Field", label: "Track&Field" },
  { value: "Asics", label: "Asics" },
  { value: "Olympikus", label: "Olympikus" },
];

const LOCATIONS = [
  { value: "Recife, PE", label: "Recife, PE" },
  { value: "Olinda, PE", label: "Olinda, PE" },
  { value: "Jaboatão, PE", label: "Jaboatão, PE" },
  { value: "Ipojuca, PE", label: "Ipojuca, PE" },
  { value: "Caruaru, PE", label: "Caruaru, PE" },
  { value: "Garanhuns, PE", label: "Garanhuns, PE" },
];

// Componente de seleção múltipla
function MultiSelectFilter({
  label,
  options,
  selectedValues = [],
  onSelectionChange,
  placeholder,
}: {
  label: string;
  options: { value: string; label: string }[];
  selectedValues?: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);

  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newValues.length > 0 ? newValues : []);
  };

  const displayText =
    selectedValues.length === 0
      ? placeholder
      : selectedValues.length === 1
      ? options.find((o) => o.value === selectedValues[0])?.label || selectedValues[0]
      : `${selectedValues.length} selecionados`;

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between text-xs h-9 hover:bg-accent hover:text-accent-foreground transition-colors",
              !selectedValues.length && "text-muted-foreground"
            )}
          >
            <span className="truncate">{displayText}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2" align="start">
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={() => toggleValue(option.value)}
                />
                <label
                  htmlFor={option.value}
                  className="text-sm font-medium leading-none cursor-pointer flex-1"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DashboardFiltersComponent({ filters, onFiltersChange }: DashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateArrayFilter = (key: "sport" | "eventType" | "brand" | "location", values: string[]) => {
    onFiltersChange({
      ...filters,
      [key]: values.length > 0 ? values : undefined,
    });
  };

  const updateFilter = (key: keyof DashboardFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilter = (key: keyof DashboardFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount =
    (filters.sport?.length || 0) +
    (filters.eventType?.length || 0) +
    (filters.brand?.length || 0) +
    (filters.location?.length || 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0);

  return (
    <div className="rounded-lg border border-border bg-card p-3 animate-fade-in">
      {/* Tudo em uma linha: título, filtros e botões */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Título */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold text-foreground">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs h-5 px-1.5">
              {activeFiltersCount}
            </Badge>
          )}
        </div>

        {/* Filtros - espalhados horizontalmente */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-1 min-w-[140px] max-w-[200px]">
            <MultiSelectFilter
              label="Esporte"
              options={SPORTS}
              selectedValues={filters.sport || []}
              onSelectionChange={(values) => updateArrayFilter("sport", values)}
              placeholder="Todos os esportes"
            />
          </div>

          <div className="flex-1 min-w-[120px] max-w-[160px]">
            <MultiSelectFilter
              label="Tipo"
              options={EVENT_TYPES}
              selectedValues={filters.eventType || []}
              onSelectionChange={(values) => updateArrayFilter("eventType", values)}
              placeholder="Todos os tipos"
            />
          </div>

          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <MultiSelectFilter
              label="Marca"
              options={BRANDS}
              selectedValues={filters.brand || []}
              onSelectionChange={(values) => updateArrayFilter("brand", values)}
              placeholder="Todas as marcas"
            />
          </div>

          <div className="flex-1 min-w-[160px] max-w-[220px]">
            <MultiSelectFilter
              label="Local"
              options={LOCATIONS}
              selectedValues={filters.location || []}
              onSelectionChange={(values) => updateArrayFilter("location", values)}
              placeholder="Todas as localizações"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center gap-1">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-7 px-2"
            >
              Limpar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs h-7 px-2"
          >
            {isExpanded ? "▼" : "▶"}
          </Button>
        </div>
      </div>

      {/* Filtros expandidos (datas) */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Data Inicial</label>
              <Input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                className="hover:bg-accent hover:border-accent-foreground/20 transition-colors bg-background"
              />
              {filters.dateFrom && (
                <Badge
                  variant="secondary"
                  className="mt-0.5 cursor-pointer text-xs h-4 px-1"
                  onClick={() => clearFilter("dateFrom")}
                >
                  {new Date(filters.dateFrom).toLocaleDateString("pt-BR")}
                  <X className="h-2.5 w-2.5 ml-0.5" />
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Data Final</label>
              <Input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
                min={filters.dateFrom}
                className="hover:bg-accent hover:border-accent-foreground/20 transition-colors bg-background"
              />
              {filters.dateTo && (
                <Badge
                  variant="secondary"
                  className="mt-0.5 cursor-pointer text-xs h-4 px-1"
                  onClick={() => clearFilter("dateTo")}
                >
                  {new Date(filters.dateTo).toLocaleDateString("pt-BR")}
                  <X className="h-2.5 w-2.5 ml-0.5" />
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

