import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Tag, 
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEvents } from "@/hooks/useEvents";
import { 
  useReportsStatus, 
  useGenerateReport,
  type ReportType,
  type ReportFocus,
  getReportTypeName,
  getReportFocusName,
  formatGenerationTime,
} from "@/hooks/useReports";

// =============================================================================
// CONSTANTES
// =============================================================================

const reportTypes = [
  {
    id: "market_share" as ReportType,
    title: "Market Share",
    description: "Análise de participação de mercado das marcas",
    icon: Tag,
  },
  {
    id: "audience_segmentation" as ReportType,
    title: "Segmentação de Público",
    description: "Perfil demográfico e preferências por segmento",
    icon: Users,
  },
  {
    id: "event_metrics" as ReportType,
    title: "Métricas do Evento",
    description: "Resumo executivo de um evento específico",
    icon: BarChart3,
  },
];

const SPORTS = [
  { value: "corrida", label: "Corrida" },
  { value: "triathlon", label: "Triathlon" },
  { value: "ciclismo", label: "Ciclismo" },
  { value: "vôlei", label: "Vôlei" },
  { value: "futebol", label: "Futebol" },
];

const PRODUCTS = [
  { value: "tênis", label: "Tênis" },
  { value: "camiseta", label: "Camiseta" },
  { value: "short", label: "Short" },
  { value: "óculos", label: "Óculos" },
  { value: "boné", label: "Boné" },
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
  { value: "Recife, PE", label: "Recife" },
  { value: "Olinda, PE", label: "Olinda" },
  { value: "Jaboatão", label: "Jaboatão" },
  { value: "Ipojuca, PE", label: "Ipojuca" },
  { value: "Caruaru, PE", label: "Caruaru" },
  { value: "Garanhuns, PE", label: "Garanhuns" },
];

const FOCUS_OPTIONS: { value: ReportFocus; label: string }[] = [
  { value: "general", label: "Visão Geral (360°)" },
  { value: "brands", label: "Foco em Marcas" },
  { value: "products", label: "Foco em Produtos" },
  { value: "audience", label: "Foco em Público" },
];

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const Reports = () => {
  // Estado do tipo de relatório selecionado
  const [selectedType, setSelectedType] = useState<ReportType | "">("");
  
  // Estados dos filtros comuns
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [sport, setSport] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  
  // Estados específicos por tipo
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [reportFocus, setReportFocus] = useState<ReportFocus>("general");
  
  // Estado do relatório gerado
  const [generatedReport, setGeneratedReport] = useState<{
    title: string;
    content: string;
    metadata: {
      total_events: number;
      total_athletes: number;
      tokens_used: number;
      generation_time_ms: number;
    };
  } | null>(null);

  // Hooks
  const { data: statusData } = useReportsStatus();
  const { data: eventsData } = useEvents(100, 0);
  const generateMutation = useGenerateReport();

  // Lista de eventos para o select
  const events = eventsData?.events || [];

  // Verifica se pode gerar relatório
  const canGenerate = useMemo(() => {
    if (!selectedType) return false;
    
    if (selectedType === "event_metrics") {
      return !!selectedEventId;
    }
    
    return !!dateFrom && !!dateTo;
  }, [selectedType, dateFrom, dateTo, selectedEventId]);

  // Handler para gerar relatório
  const handleGenerateReport = async () => {
    if (!selectedType || !canGenerate) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    let filters: Record<string, unknown> = {};

    if (selectedType === "market_share") {
      filters = {
        date_from: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        date_to: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
        sport: sport || undefined,
        location: location || undefined,
        product_type: productType || undefined,
        brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      };
    } else if (selectedType === "audience_segmentation") {
      filters = {
        date_from: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        date_to: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
        sport: sport || undefined,
        location: location || undefined,
        product_type: productType || undefined,
      };
    } else if (selectedType === "event_metrics") {
      filters = {
        event_id: selectedEventId,
        focus: reportFocus,
      };
    }

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    try {
      const result = await generateMutation.mutateAsync({
        type: selectedType,
        filters: filters as any,
      });

      setGeneratedReport({
        title: result.title,
        content: result.content,
        metadata: result.metadata,
      });

      toast.success("Relatório gerado com sucesso!", {
        description: `Gerado em ${formatGenerationTime(result.metadata.generation_time_ms)}`,
      });
    } catch (error) {
      toast.error("Erro ao gerar relatório", {
        description: error instanceof Error ? error.message : "Tente novamente",
      });
    }
  };

  // Handler para download
  const handleDownload = (format: 'txt' | 'json') => {
    if (!generatedReport) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(generatedReport, null, 2);
      filename = `relatorio-${selectedType}-${Date.now()}.json`;
      mimeType = 'application/json';
    } else {
      content = `${generatedReport.title}\n${'='.repeat(50)}\n\n${generatedReport.content}`;
      filename = `relatorio-${selectedType}-${Date.now()}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Download iniciado: ${filename}`);
  };

  // Handler para toggle de marca
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Limpar formulário
  const handleClear = () => {
    setSelectedType("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setSport("");
    setLocation("");
    setProductType("");
    setSelectedBrands([]);
    setSelectedEventId("");
    setReportFocus("general");
    setGeneratedReport(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64 transition-all duration-300">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
              <p className="text-muted-foreground mt-1">
                Gere relatórios analíticos com inteligência artificial
              </p>
            </div>
            {statusData && (
              <Badge 
                variant={statusData.available ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {statusData.available ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    LLM Disponível ({statusData.model})
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    LLM Indisponível
                  </>
                )}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuração do Relatório */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Configurar Relatório
                </CardTitle>
                <CardDescription>
                  Selecione o tipo e configure os filtros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tipo de Relatório */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Tipo de Relatório *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {reportTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedType(type.id);
                          setGeneratedReport(null);
                        }}
                        className={cn(
                          "p-4 rounded-lg border text-left transition-all duration-200 flex items-start gap-4",
                          selectedType === type.id
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-background"
                        )}
                      >
                        <type.icon className={cn(
                          "h-6 w-6 mt-0.5 shrink-0",
                          selectedType === type.id ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div>
                          <h3 className="font-medium text-foreground">{type.title}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{type.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtros Dinâmicos baseados no tipo */}
                {selectedType && selectedType !== "event_metrics" && (
                  <>
                    {/* Período */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Data Inicial *
                        </label>
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
                              {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
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
                        <label className="text-sm font-medium text-foreground">
                          Data Final *
                        </label>
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
                              {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
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

                    {/* Filtros Opcionais */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Esporte</label>
                        <Select value={sport || "__all__"} onValueChange={(v) => setSport(v === "__all__" ? "" : v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__all__">Todos</SelectItem>
                            {SPORTS.map(s => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Local</label>
                        <Select value={location || "__all__"} onValueChange={(v) => setLocation(v === "__all__" ? "" : v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__all__">Todos</SelectItem>
                            {LOCATIONS.map(l => (
                              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Tipo de Produto</label>
                      <Select value={productType || "__all__"} onValueChange={(v) => setProductType(v === "__all__" ? "" : v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">Todos</SelectItem>
                          {PRODUCTS.map(p => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Filtros específicos para Market Share */}
                {selectedType === "market_share" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Marcas para Analisar
                    </label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Deixe vazio para analisar todas
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {BRANDS.map(brand => (
                        <div key={brand.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={brand.value}
                            checked={selectedBrands.includes(brand.value)}
                            onCheckedChange={() => toggleBrand(brand.value)}
                          />
                          <label
                            htmlFor={brand.value}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {brand.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtros específicos para Métricas do Evento */}
                {selectedType === "event_metrics" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Selecione o Evento *
                      </label>
                      <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um evento" />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map(event => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.event_name} - {format(new Date(event.event_date), "dd/MM/yyyy")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Foco do Relatório
                      </label>
                      <Select value={reportFocus} onValueChange={(v) => setReportFocus(v as ReportFocus)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FOCUS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleGenerateReport}
                    disabled={!canGenerate || generateMutation.isPending || !statusData?.available}
                    className="flex-1"
                    size="lg"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Gerar Relatório
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resultado do Relatório */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Relatório Gerado
                </CardTitle>
                <CardDescription>
                  {generatedReport 
                    ? `Gerado em ${formatGenerationTime(generatedReport.metadata.generation_time_ms)}`
                    : "Configure e gere um relatório para visualizar aqui"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generateMutation.isPending ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                    <p className="text-lg font-medium">Gerando relatório...</p>
                    <p className="text-sm">Isso pode levar alguns segundos</p>
                  </div>
                ) : generatedReport ? (
                  <div className="space-y-4">
                    {/* Título */}
                    <div className="border-b border-border pb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {generatedReport.title}
                      </h3>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          {generatedReport.metadata.total_events} eventos
                        </Badge>
                        <Badge variant="outline">
                          {generatedReport.metadata.total_athletes.toLocaleString()} atletas
                        </Badge>
                        <Badge variant="secondary">
                          {generatedReport.metadata.tokens_used} tokens
                        </Badge>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="prose prose-sm prose-invert max-w-none">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {generatedReport.content}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload('txt')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download TXT
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload('json')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download JSON
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">Nenhum relatório gerado</p>
                    <p className="text-sm text-center max-w-xs mt-1">
                      Selecione um tipo de relatório e configure os filtros para gerar seu primeiro relatório com IA.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
