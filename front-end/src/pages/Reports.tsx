import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Tag, 
  Users,
  FileSpreadsheet,
  FileJson,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const reportTypes = [
  {
    id: "brand-presence",
    title: "Presença de Marcas",
    description: "Análise detalhada da presença de marcas em eventos",
    icon: Tag,
  },
  {
    id: "event-analysis",
    title: "Análise de Eventos",
    description: "Métricas e insights por evento processado",
    icon: BarChart3,
  },
  {
    id: "athlete-insights",
    title: "Insights de Atletas",
    description: "Perfil comportamental e preferências de atletas",
    icon: Users,
  },
];

const recentReports = [
  {
    id: 1,
    name: "Presença Nike - Maratona SP 2024",
    type: "brand-presence",
    date: "2024-01-15",
    status: "completed",
    format: "PDF",
  },
  {
    id: 2,
    name: "Análise Geral - Janeiro 2024",
    type: "event-analysis",
    date: "2024-01-10",
    status: "completed",
    format: "CSV",
  },
  {
    id: 3,
    name: "Perfil Atletas Corrida",
    type: "athlete-insights",
    date: "2024-01-08",
    status: "completed",
    format: "PDF",
  },
];

const Reports = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleGenerateReport = () => {
    if (!selectedType) {
      toast.error("Selecione um tipo de relatório");
      return;
    }
    if (!dateFrom || !dateTo) {
      toast.error("Selecione o período do relatório");
      return;
    }
    
    toast.success("Relatório sendo gerado...", {
      description: "Você será notificado quando estiver pronto.",
    });
  };

  const handleDownload = (reportName: string) => {
    toast.success(`Download iniciado: ${reportName}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64 transition-all duration-300">
        <Header />
        
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground mt-1">Gere e exporte relatórios personalizados</p>
          </div>

          {/* Report Generator */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Gerar Novo Relatório
              </CardTitle>
              <CardDescription>
                Configure os parâmetros e gere um relatório personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Tipo de Relatório</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reportTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-all duration-200",
                        selectedType === type.id
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-background"
                      )}
                    >
                      <type.icon className={cn(
                        "h-8 w-8 mb-3",
                        selectedType === type.id ? "text-primary" : "text-muted-foreground"
                      )} />
                      <h3 className="font-medium text-foreground">{type.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Data Inicial</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Data Final</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Export Format */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Formato de Exportação</label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF - Relatório Visual
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        CSV - Dados Tabulares
                      </div>
                    </SelectItem>
                    <SelectItem value="json">
                      <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4" />
                        JSON - Integração API
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerateReport}
                className="w-full md:w-auto"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Relatórios Recentes
              </CardTitle>
              <CardDescription>
                Seus últimos relatórios gerados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(report.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {report.format}
                      </Badge>
                      <Badge variant="secondary" className="text-xs text-chart-2">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(report.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;
