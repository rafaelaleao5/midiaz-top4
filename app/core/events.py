"""
Lógica de negócio para eventos e métricas
Camada que orquestra serviços e aplica regras de negócio
"""

from typing import List, Dict, Any, Optional
from app.services.database import DatabaseService


class EventsService:
    """Serviço de lógica de negócio para eventos"""
    
    def __init__(self, db_service: DatabaseService):
        self.db = db_service
    
    def list_events(self, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Lista eventos com paginação
        Retorna eventos ordenados por data (mais recentes primeiro)
        """
        events = self.db.get_events(limit=limit, offset=offset)
        total = self.db.count_events()
        
        return {
            "events": events,
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": (offset + limit) < total
        }
    
    def get_event_details(self, event_id: str) -> Optional[Dict[str, Any]]:
        """
        Busca detalhes completos de um evento
        Inclui informações básicas do evento
        """
        event = self.db.get_event_by_id(event_id)
        return event
    
    def get_event_brands(self, event_id: str) -> List[Dict[str, Any]]:
        """
        Retorna resumo de marcas de um evento
        Ordenado por brand_share_percent (maior para menor)
        """
        brands = self.db.get_brand_summary(event_id)
        return brands
    
    def get_event_products(self, event_id: str) -> List[Dict[str, Any]]:
        """
        Retorna resumo de produtos de um evento
        Ordenado por product_share_percent (maior para menor)
        """
        products = self.db.get_product_summary(event_id)
        return products
    
    def get_dashboard_metrics(self) -> Dict[str, Any]:
        """
        Retorna KPIs agregados para o dashboard
        Calcula métricas gerais do sistema
        """
        metrics = self.db.get_dashboard_metrics()
        
        # Adicionar métricas calculadas
        # Precisão média (placeholder - pode ser calculada depois)
        metrics["avg_accuracy"] = 94.7  # TODO: Calcular baseado em dados reais
        
        # Tempo médio de processamento (placeholder)
        metrics["avg_processing_time"] = 2.3  # TODO: Calcular baseado em dados reais
        
        return metrics

