"""
Lógica de negócio para eventos e métricas
Camada que orquestra serviços e aplica regras de negócio
"""

from typing import List, Dict, Any, Optional
from collections import defaultdict
from datetime import datetime
from app.services.database import DatabaseService


class EventsService:
    """Serviço de lógica de negócio para eventos"""
    
    def __init__(self, db_service: DatabaseService):
        self.db = db_service
    
    def list_events(
        self, 
        limit: int = 100, 
        offset: int = 0,
        sport: Optional[str] = None,
        event_type: Optional[str] = None,
        location: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Lista eventos com paginação e filtros
        Retorna eventos ordenados por data (mais recentes primeiro)
        """
        events = self.db.get_events(
            limit=limit, 
            offset=offset,
            sport=sport,
            event_type=event_type,
            location=location,
            date_from=date_from,
            date_to=date_to
        )
        total = self.db.count_events(
            sport=sport,
            event_type=event_type,
            location=location,
            date_from=date_from,
            date_to=date_to
        )
        
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
    
    def get_dashboard_metrics(
        self,
        sport: Optional[str] = None,
        event_type: Optional[str] = None,
        location: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retorna KPIs agregados para o dashboard com filtros
        """
        metrics = self.db.get_dashboard_metrics(
            sport=sport,
            event_type=event_type,
            location=location,
            date_from=date_from,
            date_to=date_to
        )
        return metrics
    
    def get_brand_time_series(
        self,
        sport: Optional[str] = None,
        event_type: Optional[str] = None,
        location: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Retorna dados temporais de marcas agrupados por mês
        
        Retorna lista de objetos com:
        - date: mês no formato "Jan", "Fev", etc.
        - nike, adidas, mizuno, etc.: total de itens por marca
        """
        # Mapeamento de mês para nome abreviado em português
        month_names = {
            1: "Jan", 2: "Fev", 3: "Mar", 4: "Abr", 5: "Mai", 6: "Jun",
            7: "Jul", 8: "Ago", 9: "Set", 10: "Out", 11: "Nov", 12: "Dez"
        }
        
        # Buscar dados do banco (com filtros)
        raw_data = self.db.get_brand_time_series(
            sport=sport,
            event_type=event_type,
            location=location,
            date_from=date_from,
            date_to=date_to
        )
        
        if not raw_data:
            return []
        
        # Agrupar por mês e marca
        # Estrutura: {(ano, mês): {marca: total_items}}
        monthly_data: Dict[tuple, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
        
        for item in raw_data:
            event_date = item.get("event_date")
            brand = item.get("brand")
            total_items = item.get("total_items", 0)
            
            if not event_date or not brand:
                continue
            
            # Parsear a data (formato: YYYY-MM-DD)
            try:
                date_obj = datetime.strptime(event_date, "%Y-%m-%d")
                year_month = (date_obj.year, date_obj.month)
                # Normalizar nome da marca para minúsculo
                brand_key = brand.lower().replace("&", "")
                monthly_data[year_month][brand_key] += total_items
            except (ValueError, TypeError):
                continue
        
        # Converter para formato de saída
        result = []
        for (year, month) in sorted(monthly_data.keys()):
            entry = {
                "date": month_names.get(month, str(month)),
                "year": year,
                "month": month,
            }
            # Adicionar dados de cada marca
            for brand, total in monthly_data[(year, month)].items():
                entry[brand] = total
            result.append(entry)
        
        return result
