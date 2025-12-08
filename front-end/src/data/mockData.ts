// Mock data for Midiaz B2B Dashboard

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  sport: string;
  photosAnalyzed: number;
  athletesDetected: number;
  brandsDetected: number;
}

export interface BrandMetric {
  brand: string;
  logo: string;
  category: string;
  appearances: number;
  events: number;
  growthPercent: number;
  marketShare: number;
}

export interface SportDistribution {
  sport: string;
  percentage: number;
  events: number;
}

export interface TimeSeriesData {
  date: string;
  nike: number;
  adidas: number;
  asics: number;
  mizuno: number;
}

export const mockEvents: Event[] = [
  {
    id: "evt-001",
    name: "Maratona de São Paulo 2024",
    date: "2024-04-07",
    location: "São Paulo, SP",
    sport: "Corrida",
    photosAnalyzed: 45230,
    athletesDetected: 12450,
    brandsDetected: 87,
  },
  {
    id: "evt-002",
    name: "Ironman 70.3 Florianópolis",
    date: "2024-04-14",
    location: "Florianópolis, SC",
    sport: "Triathlon",
    photosAnalyzed: 28750,
    athletesDetected: 3200,
    brandsDetected: 64,
  },
  {
    id: "evt-003",
    name: "Circuito de Corridas Corpore",
    date: "2024-03-24",
    location: "Rio de Janeiro, RJ",
    sport: "Corrida",
    photosAnalyzed: 18900,
    athletesDetected: 5600,
    brandsDetected: 52,
  },
  {
    id: "evt-004",
    name: "Brasil Ride 2024",
    date: "2024-03-15",
    location: "Arraial d'Ajuda, BA",
    sport: "Ciclismo",
    photosAnalyzed: 32100,
    athletesDetected: 1800,
    brandsDetected: 71,
  },
  {
    id: "evt-005",
    name: "Volta da Pampulha",
    date: "2024-03-03",
    location: "Belo Horizonte, MG",
    sport: "Corrida",
    photosAnalyzed: 22400,
    athletesDetected: 8900,
    brandsDetected: 45,
  },
];

export const mockBrandMetrics: BrandMetric[] = [
  {
    brand: "Nike",
    logo: "N",
    category: "Calçados & Vestuário",
    appearances: 34520,
    events: 48,
    growthPercent: 12.5,
    marketShare: 28.4,
  },
  {
    brand: "Adidas",
    logo: "A",
    category: "Calçados & Vestuário",
    appearances: 28900,
    events: 45,
    growthPercent: 8.2,
    marketShare: 23.8,
  },
  {
    brand: "Asics",
    logo: "AS",
    category: "Calçados",
    appearances: 19450,
    events: 42,
    growthPercent: 15.7,
    marketShare: 16.0,
  },
  {
    brand: "Mizuno",
    logo: "M",
    category: "Calçados",
    appearances: 12300,
    events: 38,
    growthPercent: -2.3,
    marketShare: 10.1,
  },
  {
    brand: "Garmin",
    logo: "G",
    category: "Wearables",
    appearances: 8900,
    events: 35,
    growthPercent: 22.1,
    marketShare: 7.3,
  },
  {
    brand: "Oakley",
    logo: "O",
    category: "Acessórios",
    appearances: 7650,
    events: 32,
    growthPercent: 5.4,
    marketShare: 6.3,
  },
];

export const mockSportDistribution: SportDistribution[] = [
  { sport: "Corrida", percentage: 45, events: 124 },
  { sport: "Triathlon", percentage: 22, events: 61 },
  { sport: "Ciclismo", percentage: 18, events: 50 },
  { sport: "Natação", percentage: 10, events: 28 },
  { sport: "Outros", percentage: 5, events: 14 },
];

export const mockTimeSeriesData: TimeSeriesData[] = [
  { date: "Jan", nike: 4200, adidas: 3800, asics: 2400, mizuno: 1800 },
  { date: "Fev", nike: 4800, adidas: 4100, asics: 2800, mizuno: 1950 },
  { date: "Mar", nike: 5200, adidas: 4300, asics: 3100, mizuno: 2100 },
  { date: "Abr", nike: 6100, adidas: 4800, asics: 3400, mizuno: 2050 },
  { date: "Mai", nike: 5800, adidas: 4600, asics: 3200, mizuno: 1900 },
  { date: "Jun", nike: 6400, adidas: 5100, asics: 3600, mizuno: 2200 },
];

export const dashboardKPIs = {
  totalPhotosAnalyzed: 2847650,
  totalEventsProcessed: 277,
  totalBrandsTracked: 156,
  totalAthletesIdentified: 89420,
  avgAccuracy: 94.7,
  processingTime: 2.3,
};
