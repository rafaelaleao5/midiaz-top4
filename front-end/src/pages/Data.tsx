import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Database } from "lucide-react";

const Data = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64 transition-all duration-300">
        <Header />
        
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Dados</h1>
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Database className="h-16 w-16 mb-4" />
            <p className="text-lg">Gestão de dados em desenvolvimento</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Data;
