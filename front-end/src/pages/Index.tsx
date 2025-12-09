import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { BrandChart } from "@/components/dashboard/BrandChart";
import { EventsTable } from "@/components/dashboard/EventsTable";
import { BrandsRanking } from "@/components/dashboard/BrandsRanking";
import { SportDistribution } from "@/components/dashboard/SportDistribution";
import { dashboardKPIs } from "@/data/mockData";
import { Camera, Calendar, Tag, Users } from "lucide-react";

const Index = () => {
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
              value={dashboardKPIs.totalPhotosAnalyzed}
              change={14.2}
              icon={Camera}
            />
            <KPICard
              title="Eventos Processados"
              value={dashboardKPIs.totalEventsProcessed}
              change={8.5}
              icon={Calendar}
            />
            <KPICard
              title="Marcas Rastreadas"
              value={dashboardKPIs.totalBrandsTracked}
              change={5.3}
              icon={Tag}
            />
            <KPICard
              title="Atletas Identificados"
              value={dashboardKPIs.totalAthletesIdentified}
              change={12.8}
              icon={Users}
            />
            {/* Removido: KPIs de Precisão IA e Tempo Médio (não disponíveis no banco) */}
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
