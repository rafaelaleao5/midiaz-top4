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
        """Buscar todos os eventos"""
        response = (
            self.client.table("events")
            .select("*")
            .order("event_date", desc=True)
            .limit(limit)
            .offset(offset)
            .execute()
        )
        return response.data
    
    def get_event_by_id(self, event_id: str) -> Optional[Dict[str, Any]]:
        """Buscar evento por ID"""
        response = (
            self.client.table("events")
            .select("*")
            .eq("id", event_id)
            .single()
            .execute()
        )
        return response.data if response.data else None
    
    def get_brand_summary(self, event_id: str) -> List[Dict[str, Any]]:
        """Buscar resumo de marcas por evento"""
        response = (
            self.client.table("brand_event_summary")
            .select("*")
            .eq("event_id", event_id)
            .order("brand_share_percent", desc=True)
            .execute()
        )
        return response.data
    
    def get_product_summary(self, event_id: str) -> List[Dict[str, Any]]:
        """Buscar resumo de produtos por evento"""
        response = (
            self.client.table("product_event_summary")
            .select("*")
            .eq("event_id", event_id)
            .order("product_share_percent", desc=True)
            .execute()
        )
        return response.data
    
    def get_persons_by_event(self, event_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Buscar pessoas de um evento"""
        response = (
            self.client.table("event_persons")
            .select("*")
            .eq("event_id", event_id)
            .limit(limit)
            .execute()
        )
        return response.data
    
    def get_items_by_event(self, event_id: str, limit: int = 1000) -> List[Dict[str, Any]]:
        """Buscar itens de um evento"""
        response = (
            self.client.table("person_items")
            .select("*")
            .eq("event_id", event_id)
            .limit(limit)
            .execute()
        )
        return response.data


# Instância global do serviço
db_service = DatabaseService()

