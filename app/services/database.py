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
            
            # Total de atletas identificados (contagem direta de event_persons)
            # Usar contagem direta para garantir precisão
            athletes_response = (
                self.client.table("event_persons")
                .select("person_id", count="exact")
                .execute()
            )
            total_athletes = athletes_response.count if hasattr(athletes_response, 'count') else len(set(
                person.get("person_id") 
                for person in (athletes_response.data or []) 
                if person.get("person_id")
            ))
            
            # Total de marcas rastreadas (marcas únicas em person_items)
            # Buscar todas as marcas com paginação (Supabase limita a 1000 por padrão)
            all_brands = set()
            page_size = 1000
            offset = 0
            page_num = 0
            
            while True:
                brands_response = (
                    self.client.table("person_items")
                    .select("brand")
                    .range(offset, offset + page_size - 1)
                    .execute()
                )
                
                if not brands_response.data or len(brands_response.data) == 0:
                    break
                
                page_num += 1
                page_brands = set()
                
                # Adicionar marcas desta página
                for item in brands_response.data:
                    brand = item.get("brand")
                    if brand:
                        all_brands.add(brand)
                        page_brands.add(brand)
                
                # Se retornou menos que page_size, verificar se há mais dados
                if len(brands_response.data) < page_size:
                    # Tentar buscar próxima página para confirmar que não há mais dados
                    offset += page_size
                    try:
                        next_response = (
                            self.client.table("person_items")
                            .select("brand")
                            .range(offset, offset + 1)
                            .execute()
                        )
                        if not next_response.data or len(next_response.data) == 0:
                            break
                    except Exception as e:
                        break
                else:
                    # Retornou page_size registros, definitivamente há mais dados
                    offset += page_size
                
                # Limite de segurança para evitar loop infinito
                if offset > 100000:
                    break
            
            unique_brands = len(all_brands)
            
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
    
    def get_brand_time_series(self) -> List[Dict[str, Any]]:
        """
        Buscar dados de marcas agregados por evento com data
        Retorna dados da view brand_event_summary com informações de data
        """
        try:
            response = (
                self.client.table("brand_event_summary")
                .select("event_id, event_name, event_date, brand, total_items")
                .order("event_date", desc=False)
                .execute()
            )
            return response.data or []
        except Exception as e:
            print(f"Erro ao buscar dados temporais de marcas: {e}")
            return []


# Instância global do serviço
db_service = DatabaseService()

