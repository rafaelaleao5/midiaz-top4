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
} from '@/services/api/events';

/**
 * Hook para listar eventos com paginação
 */
export function useEvents(limit: number = 100, offset: number = 0) {
  return useQuery<EventListResponse, Error>({
    queryKey: ['events', limit, offset],
    queryFn: () => getEvents(limit, offset),
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
 * Hook para buscar métricas do dashboard
 */
export function useDashboardMetrics() {
  return useQuery<DashboardMetrics, Error>({
    queryKey: ['dashboard-metrics'],
    queryFn: () => getDashboardMetrics(),
    staleTime: 60000, // 1 minuto - métricas mudam menos frequentemente
  });
}

/**
 * Hook para buscar dados temporais de marcas
 */
export function useBrandTimeSeries() {
  return useQuery<BrandTimeSeriesResponse, Error>({
    queryKey: ['brand-time-series'],
    queryFn: () => getBrandTimeSeries(),
    staleTime: 60000, // 1 minuto
  });
}

