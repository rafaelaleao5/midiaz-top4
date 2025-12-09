/**
 * Funções para chamadas de API relacionadas a eventos e métricas
 * Usa o cliente HTTP centralizado
 */

import { api } from './client';

// Tipos TypeScript (alinhados com o backend)
export interface Event {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  event_location: string;
  total_photos: number;
  total_athletes_estimated: number;
  status: string;
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
 * Lista todos os eventos com paginação
 */
export async function getEvents(
  limit: number = 100,
  offset: number = 0
): Promise<EventListResponse> {
  return api.get<EventListResponse>('/api/events', { limit, offset });
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
 * Busca KPIs agregados para o dashboard
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return api.get<DashboardMetrics>('/api/metrics/dashboard');
}

