/**
 * Funções para chamadas de API relacionadas a eventos e métricas
 * Usa o cliente HTTP centralizado
 */

import { api } from './client';

// Tipos TypeScript (alinhados com o backend)
export interface Event {
  id: string;
  event_name: string;
  event_type: 'prova' | 'treino';
  sport: 'corrida' | 'triathlon' | 'ciclismo' | 'vôlei' | 'futebol';
  event_date: string;
  event_location: string;
  total_photos: number;
  total_athletes_estimated: number;
  status: 'created' | 'processing' | 'completed' | 'failed';
  created_at: string;
  processed_at?: string;
  metadata?: Record<string, unknown>;
}

export interface EventListResponse {
  events: Event[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface BrandSummary {
  event_id: string;
  event_name: string;
  event_date: string;
  brand: string;
  persons_with_brand: number;
  total_items: number;
  brand_share_percent: number;
  person_coverage_percent: number;
}

export interface ProductSummary {
  event_id: string;
  event_name: string;
  product_type: string;
  persons_with_product: number;
  total_items: number;
  product_share_percent: number;
}

export interface DashboardMetrics {
  total_events: number;
  total_photos_analyzed: number;
  total_athletes_identified: number;
  total_brands_tracked: number;
}

/**
 * Parâmetros de filtro para queries
 */
export interface FilterParams {
  sport?: string;
  event_type?: string;
  location?: string;
  date_from?: string;
  date_to?: string;
}

/**
 * Lista eventos com paginação e filtros
 */
export async function getEvents(
  limit: number = 100,
  offset: number = 0,
  filters?: FilterParams
): Promise<EventListResponse> {
  const params: Record<string, string | number> = { limit, offset };
  
  if (filters?.sport) params.sport = filters.sport;
  if (filters?.event_type) params.event_type = filters.event_type;
  if (filters?.location) params.location = filters.location;
  if (filters?.date_from) params.date_from = filters.date_from;
  if (filters?.date_to) params.date_to = filters.date_to;
  
  return api.get<EventListResponse>('/api/events', params);
}

/**
 * Busca detalhes de um evento específico
 */
export async function getEventById(eventId: string): Promise<Event> {
  return api.get<Event>(`/api/events/${eventId}`);
}

/**
 * Busca resumo de marcas de um evento
 */
export async function getEventBrands(
  eventId: string
): Promise<{ event_id: string; brands: BrandSummary[] }> {
  return api.get<{ event_id: string; brands: BrandSummary[] }>(
    `/api/events/${eventId}/brands`
  );
}

/**
 * Busca resumo de produtos de um evento
 */
export async function getEventProducts(
  eventId: string
): Promise<{ event_id: string; products: ProductSummary[] }> {
  return api.get<{ event_id: string; products: ProductSummary[] }>(
    `/api/events/${eventId}/products`
  );
}

/**
 * Busca KPIs agregados para o dashboard com filtros
 */
export async function getDashboardMetrics(filters?: FilterParams): Promise<DashboardMetrics> {
  const params: Record<string, string> = {};
  
  if (filters?.sport) params.sport = filters.sport;
  if (filters?.event_type) params.event_type = filters.event_type;
  if (filters?.location) params.location = filters.location;
  if (filters?.date_from) params.date_from = filters.date_from;
  if (filters?.date_to) params.date_to = filters.date_to;
  
  return api.get<DashboardMetrics>('/api/metrics/dashboard', Object.keys(params).length > 0 ? params : undefined);
}

/**
 * Dados temporais de marcas por mês
 */
export interface BrandTimeSeriesEntry {
  date: string;
  year: number;
  month: number;
  nike?: number;
  adidas?: number;
  mizuno?: number;
  trackfield?: number;
  asics?: number;
  olympikus?: number;
  [key: string]: string | number | undefined;
}

export interface BrandTimeSeriesResponse {
  data: BrandTimeSeriesEntry[];
}

/**
 * Busca dados temporais de marcas agrupados por mês com filtros
 */
export async function getBrandTimeSeries(filters?: FilterParams): Promise<BrandTimeSeriesResponse> {
  const params: Record<string, string> = {};
  
  if (filters?.sport) params.sport = filters.sport;
  if (filters?.event_type) params.event_type = filters.event_type;
  if (filters?.location) params.location = filters.location;
  if (filters?.date_from) params.date_from = filters.date_from;
  if (filters?.date_to) params.date_to = filters.date_to;
  if (filters?.brand) params.brand = filters.brand;
  
  return api.get<BrandTimeSeriesResponse>('/api/metrics/brands/timeseries', Object.keys(params).length > 0 ? params : undefined);
}
