import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { BrandsRanking } from "@/components/dashboard/BrandsRanking";
import { BrandChart } from "@/components/dashboard/BrandChart";

const Brands = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64 transition-all duration-300">
        <Header />
        
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Marcas</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BrandChart />
            <BrandsRanking />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Brands;
