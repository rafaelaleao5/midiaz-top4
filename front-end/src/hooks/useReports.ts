/**
 * React Query hooks para gerenciar geração de relatórios
 * Facilita loading states, cache e tratamento de erros
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  generateReport,
  getReportsStatus,
  type GenerateReportRequest,
  type GenerateReportResponse,
  type ReportStatusResponse,
} from '@/services/api/reports';

/**
 * Hook para verificar se o serviço de relatórios está disponível
 */
export function useReportsStatus() {
  return useQuery<ReportStatusResponse, Error>({
    queryKey: ['reports-status'],
    queryFn: getReportsStatus,
    staleTime: 60000, // 1 minuto
    retry: 1,
  });
}

/**
 * Hook para gerar relatório (mutation)
 * 
 * Uso:
 * ```tsx
 * const { mutate, isPending, data, error } = useGenerateReport();
 * 
 * const handleGenerate = () => {
 *   mutate({
 *     type: 'market_share',
 *     filters: { date_from: '2025-01-01', date_to: '2025-01-31' }
 *   });
 * };
 * ```
 */
export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation<GenerateReportResponse, Error, GenerateReportRequest>({
    mutationFn: generateReport,
    onSuccess: () => {
      // Invalida cache de status após gerar relatório
      queryClient.invalidateQueries({ queryKey: ['reports-status'] });
    },
  });
}

/**
 * Re-exportar tipos para conveniência
 */
export type {
  GenerateReportRequest,
  GenerateReportResponse,
  ReportStatusResponse,
} from '@/services/api/reports';

export {
  type ReportType,
  type ReportFocus,
  type MarketShareFilters,
  type AudienceSegmentationFilters,
  type EventMetricsFilters,
  getReportTypeName,
  getReportFocusName,
  formatGenerationTime,
  formatReportContent,
} from '@/services/api/reports';

