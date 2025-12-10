/**
 * Funções para chamadas de API relacionadas a relatórios
 * Usa o cliente HTTP centralizado
 */

import { api } from './client';

// =============================================================================
// TIPOS
// =============================================================================

export type ReportType = 'market_share' | 'audience_segmentation' | 'event_metrics';
export type ReportFocus = 'general' | 'brands' | 'products' | 'audience';

export interface MarketShareFilters {
  date_from: string;  // YYYY-MM-DD
  date_to: string;    // YYYY-MM-DD
  sport?: string;
  location?: string;
  product_type?: string;
  brands?: string[];
}

export interface AudienceSegmentationFilters {
  date_from: string;
  date_to: string;
  sport?: string;
  location?: string;
  product_type?: string;
}

export interface EventMetricsFilters {
  event_id: string;
  focus?: ReportFocus;
}

export type ReportFilters = MarketShareFilters | AudienceSegmentationFilters | EventMetricsFilters;

export interface GenerateReportRequest {
  type: ReportType;
  filters: ReportFilters;
}

export interface ReportMetadata {
  total_events: number;
  total_athletes: number;
  total_items: number;
  tokens_used: number;
  model: string;
  generation_time_ms: number;
}

export interface GenerateReportResponse {
  type: ReportType;
  generated_at: string;
  filters_applied: Record<string, unknown>;
  title: string;
  content: string;
  metadata: ReportMetadata;
}

export interface ReportStatusResponse {
  available: boolean;
  model?: string;
  message: string;
}

// =============================================================================
// FUNÇÕES DE API
// =============================================================================

/**
 * Gera um relatório usando LLM
 */
export async function generateReport(
  request: GenerateReportRequest
): Promise<GenerateReportResponse> {
  return api.post<GenerateReportResponse>('/api/reports/generate', request);
}

/**
 * Verifica se o serviço de relatórios está disponível
 */
export async function getReportsStatus(): Promise<ReportStatusResponse> {
  return api.get<ReportStatusResponse>('/api/reports/status');
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Formata o conteúdo do relatório para exibição
 */
export function formatReportContent(content: string): string {
  // Adiciona quebras de linha para parágrafos
  return content.replace(/\n\n/g, '\n\n').trim();
}

/**
 * Calcula o tempo de geração em formato legível
 */
export function formatGenerationTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Retorna o nome amigável do tipo de relatório
 */
export function getReportTypeName(type: ReportType): string {
  const names: Record<ReportType, string> = {
    market_share: 'Market Share',
    audience_segmentation: 'Segmentação de Público',
    event_metrics: 'Métricas do Evento',
  };
  return names[type];
}

/**
 * Retorna o nome amigável do foco do relatório
 */
export function getReportFocusName(focus: ReportFocus): string {
  const names: Record<ReportFocus, string> = {
    general: 'Visão Geral',
    brands: 'Marcas',
    products: 'Produtos',
    audience: 'Público',
  };
  return names[focus];
}

