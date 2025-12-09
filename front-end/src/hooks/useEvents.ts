/**
 * React Query hooks para gerenciar estado de eventos e métricas
 * Facilita cache, loading states e tratamento de erros
 */

import { useQuery } from '@tanstack/react-query';
import {
  getEvents,
  getEventById,
  getEventBrands,
  getEventProducts,
  getDashboardMetrics,
  getBrandTimeSeries,
  type Event,
  type EventListResponse,
  type BrandSummary,
  type ProductSummary,
  type DashboardMetrics,
  type BrandTimeSeriesResponse,
  type FilterParams,
} from '@/services/api/events';

// Re-exportar FilterParams para uso nos componentes
export type { FilterParams };

/**
 * Hook para listar eventos com paginação e filtros
 */
export function useEvents(limit: number = 100, offset: number = 0, filters?: FilterParams) {
  return useQuery<EventListResponse, Error>({
    queryKey: ['events', limit, offset, filters],
    queryFn: () => getEvents(limit, offset, filters),
    staleTime: 30000, // 30 segundos - dados considerados "frescos"
  });
}

/**
 * Hook para buscar detalhes de um evento
 */
export function useEvent(eventId: string | null) {
  return useQuery<Event, Error>({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId!),
    enabled: !!eventId, // Só executa se eventId não for null
    staleTime: 30000,
  });
}

/**
 * Hook para buscar marcas de um evento
 */
export function useEventBrands(eventId: string | null) {
  return useQuery<{ event_id: string; brands: BrandSummary[] }, Error>({
    queryKey: ['event-brands', eventId],
    queryFn: () => getEventBrands(eventId!),
    enabled: !!eventId,
    staleTime: 30000,
  });
}

/**
 * Hook para buscar produtos de um evento
 */
export function useEventProducts(eventId: string | null) {
  return useQuery<{ event_id: string; products: ProductSummary[] }, Error>({
    queryKey: ['event-products', eventId],
    queryFn: () => getEventProducts(eventId!),
    enabled: !!eventId,
    staleTime: 30000,
  });
}

/**
 * Hook para buscar métricas do dashboard com filtros
 */
export function useDashboardMetrics(filters?: FilterParams) {
  return useQuery<DashboardMetrics, Error>({
    queryKey: ['dashboard-metrics', filters],
    queryFn: () => getDashboardMetrics(filters),
    staleTime: 60000, // 1 minuto - métricas mudam menos frequentemente
  });
}

/**
 * Hook para buscar dados temporais de marcas com filtros
 */
export function useBrandTimeSeries(filters?: FilterParams) {
  return useQuery<BrandTimeSeriesResponse, Error>({
    queryKey: ['brand-time-series', filters],
    queryFn: () => getBrandTimeSeries(filters),
    staleTime: 60000, // 1 minuto
  });
}
