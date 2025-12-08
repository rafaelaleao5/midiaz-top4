"""
Serviço de banco de dados (Supabase)
Abstração sobre o cliente Supabase para facilitar uso e testes
"""

from typing import Optional, List, Dict, Any
from supabase import create_client, Client
from app.config import settings


class DatabaseService:
    """Serviço de acesso ao banco de dados via Supabase"""
    
    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY
        )
    
    def get_events(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Buscar todos os eventos com paginação"""
        try:
            response = (
                self.client.table("events")
                .select("*")
                .order("event_date", desc=True)
                .limit(limit)
                .offset(offset)
                .execute()
            )
            return response.data or []
        except Exception as e:
            print(f"Erro ao buscar eventos: {e}")
            return []
    
    def get_event_by_id(self, event_id: str) -> Optional[Dict[str, Any]]:
        """Buscar evento por ID"""
        try:
            response = (
                self.client.table("events")
                .select("*")
                .eq("id", event_id)
                .single()
                .execute()
            )
            return response.data if response.data else None
        except Exception as e:
            print(f"Erro ao buscar evento {event_id}: {e}")
            return None
    
    def get_brand_summary(self, event_id: str) -> List[Dict[str, Any]]:
        """Buscar resumo de marcas por evento"""
        try:
            response = (
                self.client.table("brand_event_summary")
                .select("*")
                .eq("event_id", event_id)
                .order("brand_share_percent", desc=True)
                .execute()
            )
            return response.data or []
        except Exception as e:
            print(f"Erro ao buscar resumo de marcas para evento {event_id}: {e}")
            return []
    
    def get_product_summary(self, event_id: str) -> List[Dict[str, Any]]:
        """Buscar resumo de produtos por evento"""
        try:
            response = (
                self.client.table("product_event_summary")
                .select("*")
                .eq("event_id", event_id)
                .order("product_share_percent", desc=True)
                .execute()
            )
            return response.data or []
        except Exception as e:
            print(f"Erro ao buscar resumo de produtos para evento {event_id}: {e}")
            return []
    
    def get_persons_by_event(self, event_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Buscar pessoas de um evento"""
        try:
            response = (
                self.client.table("event_persons")
                .select("*")
                .eq("event_id", event_id)
                .limit(limit)
                .execute()
            )
            return response.data or []
        except Exception as e:
            print(f"Erro ao buscar pessoas do evento {event_id}: {e}")
            return []
    
    def get_items_by_event(self, event_id: str, limit: int = 1000) -> List[Dict[str, Any]]:
        """Buscar itens de um evento"""
        try:
            response = (
                self.client.table("person_items")
                .select("*")
                .eq("event_id", event_id)
                .limit(limit)
                .execute()
            )
            return response.data or []
        except Exception as e:
            print(f"Erro ao buscar itens do evento {event_id}: {e}")
            return []
    
    def get_dashboard_metrics(self) -> Dict[str, Any]:
        """
        Buscar KPIs agregados para o dashboard
        Retorna métricas gerais do sistema
        """
        try:
            # Total de eventos
            events_response = (
                self.client.table("events")
                .select("id", count="exact")
                .execute()
            )
            total_events = events_response.count if hasattr(events_response, 'count') else len(events_response.data or [])
            
            # Total de fotos analisadas (soma de total_photos de todos os eventos)
            events_data = (
                self.client.table("events")
                .select("total_photos")
                .execute()
            )
            total_photos = sum(event.get("total_photos", 0) or 0 for event in (events_data.data or []))
            
            # Total de atletas identificados (soma de total_athletes_estimated)
            total_athletes = sum(
                event.get("total_athletes_estimated", 0) or 0 
                for event in (events_data.data or [])
            )
            
            # Total de marcas rastreadas (marcas únicas em person_items)
            brands_response = (
                self.client.table("person_items")
                .select("brand")
                .execute()
            )
            unique_brands = len(set(
                item.get("brand") 
                for item in (brands_response.data or []) 
                if item.get("brand")
            ))
            
            return {
                "total_events": total_events,
                "total_photos_analyzed": total_photos,
                "total_athletes_identified": total_athletes,
                "total_brands_tracked": unique_brands,
            }
        except Exception as e:
            print(f"Erro ao buscar métricas do dashboard: {e}")
            return {
                "total_events": 0,
                "total_photos_analyzed": 0,
                "total_athletes_identified": 0,
                "total_brands_tracked": 0,
            }
    
    def count_events(self) -> int:
        """Contar total de eventos"""
        try:
            response = (
                self.client.table("events")
                .select("id", count="exact")
                .execute()
            )
            return response.count if hasattr(response, 'count') else len(response.data or [])
        except Exception as e:
            print(f"Erro ao contar eventos: {e}")
            return 0


# Instância global do serviço
db_service = DatabaseService()

