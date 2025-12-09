import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64 transition-all duration-300">
        <Header />
        
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <SettingsIcon className="h-16 w-16 mb-4" />
            <p className="text-lg">Configurações em desenvolvimento</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
