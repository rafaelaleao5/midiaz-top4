import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { EventsTable } from "@/components/dashboard/EventsTable";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64 transition-all duration-300">
        <Header />
        
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Eventos</h1>
          <EventsTable />
        </div>
      </main>
    </div>
  );
};

export default Events;
