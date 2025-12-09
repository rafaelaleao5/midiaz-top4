import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { BrandChart } from "@/components/dashboard/BrandChart";
import { EventsTable } from "@/components/dashboard/EventsTable";
import { BrandsRanking } from "@/components/dashboard/BrandsRanking";
import { SportDistribution } from "@/components/dashboard/SportDistribution";
import { DashboardFiltersComponent, type DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { useDashboardMetrics, type FilterParams } from "@/hooks/useEvents";
import { Camera, Calendar, Tag, Users } from "lucide-react";

const Index = () => {
  // Estado dos filtros do dashboard
  const [filters, setFilters] = useState<DashboardFilters>({});

  // Converter filtros do componente (arrays) para formato da API (strings)
  const apiFilters: FilterParams = useMemo(() => {
    const result: FilterParams = {};
    
    // Para filtros de array, usar o primeiro valor ou join com vírgula
    // Por simplicidade, usando o primeiro valor selecionado
    if (filters.sport && filters.sport.length > 0) {
      result.sport = filters.sport[0];
    }
    if (filters.eventType && filters.eventType.length > 0) {
      result.event_type = filters.eventType[0];
    }
    if (filters.location && filters.location.length > 0) {
      result.location = filters.location[0];
    }
    if (filters.dateFrom) {
      result.date_from = filters.dateFrom;
    }
    if (filters.dateTo) {
      result.date_to = filters.dateTo;
    }
    
    return result;
  }, [filters]);

  const { data: metrics, isLoading, error } = useDashboardMetrics(apiFilters);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-64 transition-all duration-300">
          <Header />
          <div className="p-6">
            <div className="text-center text-destructive">
              Erro ao carregar dados: {error.message}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64 transition-all duration-300">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Filtros */}
          <DashboardFiltersComponent 
            filters={filters} 
            onFiltersChange={setFilters} 
          />

          {/* KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <KPICard
              title="Fotos Analisadas"
              value={metrics?.total_photos_analyzed || 0}
              icon={Camera}
              isLoading={isLoading}
            />
            <KPICard
              title="Eventos Processados"
              value={metrics?.total_events || 0}
              icon={Calendar}
              isLoading={isLoading}
            />
            <KPICard
              title="Marcas Rastreadas"
              value={metrics?.total_brands_tracked || 0}
              icon={Tag}
              isLoading={isLoading}
            />
            <KPICard
              title="Atletas Identificados"
              value={metrics?.total_athletes_identified || 0}
              icon={Users}
              isLoading={isLoading}
            />
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BrandChart filters={apiFilters} />
            </div>
            <SportDistribution filters={apiFilters} />
          </section>

          {/* Tables Row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EventsTable filters={apiFilters} />
            <BrandsRanking filters={apiFilters} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
