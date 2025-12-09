import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { BrandChart } from "@/components/dashboard/BrandChart";
import { EventsTable } from "@/components/dashboard/EventsTable";
import { BrandsRanking } from "@/components/dashboard/BrandsRanking";
import { SportDistribution } from "@/components/dashboard/SportDistribution";
import { useDashboardMetrics } from "@/hooks/useEvents";
import { Camera, Calendar, Tag, Users } from "lucide-react";

const Index = () => {
  const { data: metrics, isLoading, error } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-64 transition-all duration-300">
          <Header />
          <div className="p-6">
            <div className="text-center text-muted-foreground">Carregando dados...</div>
          </div>
        </main>
      </div>
    );
  }

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
          {/* KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <KPICard
              title="Fotos Analisadas"
              value={metrics?.total_photos_analyzed || 0}
              icon={Camera}
            />
            <KPICard
              title="Eventos Processados"
              value={metrics?.total_events || 0}
              icon={Calendar}
            />
            <KPICard
              title="Marcas Rastreadas"
              value={metrics?.total_brands_tracked || 0}
              icon={Tag}
            />
            <KPICard
              title="Atletas Identificados"
              value={metrics?.total_athletes_identified || 0}
              icon={Users}
            />
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BrandChart />
            </div>
            <SportDistribution />
          </section>

          {/* Tables Row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EventsTable />
            <BrandsRanking />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
