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
    
    def get_events(
        self, 
        limit: int = 100, 
        offset: int = 0,
        sport: Optional[str] = None,
        event_type: Optional[str] = None,
        location: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Buscar eventos com paginação e filtros"""
        try:
            query = self.client.table("events").select("*")
            
            # Aplicar filtros (suporta múltiplos valores separados por vírgula)
            query = self._apply_event_filters(query, sport, event_type, location, date_from, date_to)
            
            response = (
                query
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
    
    def _apply_event_filters(self, query, sport: Optional[str], event_type: Optional[str], 
                               location: Optional[str], date_from: Optional[str], date_to: Optional[str]):
        """Aplicar filtros comuns a queries de eventos
        Suporta múltiplos valores separados por vírgula para sport, event_type e location
        """
        if sport:
            sports = [s.strip() for s in sport.split(",")]
            if len(sports) > 1:
                query = query.in_("sport", sports)
            else:
                query = query.eq("sport", sports[0])
        if event_type:
            types = [t.strip() for t in event_type.split(",")]
            if len(types) > 1:
                query = query.in_("event_type", types)
            else:
                query = query.eq("event_type", types[0])
        if location:
            locations = [l.strip() for l in location.split(",")]
            if len(locations) > 1:
                # Para múltiplas localizações, usar OR com ilike
                # Supabase não suporta múltiplos ilike diretamente, então usamos or_
                location_filters = ",".join([f"event_location.ilike.%{loc}%" for loc in locations])
                query = query.or_(location_filters)
            else:
                query = query.ilike("event_location", f"%{locations[0]}%")
        if date_from:
            query = query.gte("event_date", date_from)
        if date_to:
            query = query.lte("event_date", date_to)
        return query
    
    def _get_filtered_event_ids(self, sport: Optional[str] = None, event_type: Optional[str] = None,
                                 location: Optional[str] = None, date_from: Optional[str] = None,
                                 date_to: Optional[str] = None) -> List[str]:
        """Buscar IDs de eventos que correspondem aos filtros"""
        query = self.client.table("events").select("id")
        query = self._apply_event_filters(query, sport, event_type, location, date_from, date_to)
        response = query.execute()
        return [e["id"] for e in (response.data or [])]
    
    def get_dashboard_metrics(
        self,
        sport: Optional[str] = None,
        event_type: Optional[str] = None,
        location: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Buscar KPIs agregados para o dashboard com filtros
        Retorna métricas filtradas do sistema
        """
        try:
            has_filters = any([sport, event_type, location, date_from, date_to])
            
            # Total de eventos (com filtros)
            events_query = self.client.table("events").select("id, total_photos", count="exact")
            events_query = self._apply_event_filters(events_query, sport, event_type, location, date_from, date_to)
            events_response = events_query.execute()
            
            total_events = events_response.count if hasattr(events_response, 'count') else len(events_response.data or [])
            total_photos = sum(event.get("total_photos", 0) or 0 for event in (events_response.data or []))
            
            # Se há filtros, precisamos filtrar atletas e marcas pelos event_ids
            if has_filters:
                event_ids = [e["id"] for e in (events_response.data or [])]
                
                if not event_ids:
                    return {
                        "total_events": 0,
                        "total_photos_analyzed": 0,
                        "total_athletes_identified": 0,
                        "total_brands_tracked": 0,
                    }
                
                # Total de atletas nos eventos filtrados
                total_athletes = 0
                all_brands = set()
                
                for event_id in event_ids:
                    # Contar atletas por evento
                    athletes_resp = (
                        self.client.table("event_persons")
                        .select("person_id", count="exact")
                        .eq("event_id", event_id)
                        .execute()
                    )
                    total_athletes += athletes_resp.count if hasattr(athletes_resp, 'count') else len(athletes_resp.data or [])
                    
                    # Buscar marcas por evento
                    brands_resp = (
                        self.client.table("person_items")
                        .select("brand")
                        .eq("event_id", event_id)
                        .execute()
                    )
                    for item in (brands_resp.data or []):
                        if item.get("brand"):
                            all_brands.add(item["brand"])
                
                unique_brands = len(all_brands)
            else:
                # Sem filtros - buscar todos
                athletes_response = (
                    self.client.table("event_persons")
                    .select("person_id", count="exact")
                    .execute()
                )
                total_athletes = athletes_response.count if hasattr(athletes_response, 'count') else len(athletes_response.data or [])
                
                # Marcas únicas - usar a view brand_event_summary que já tem marcas agregadas
                # Isso é mais eficiente que buscar em person_items
                all_brands = set()
                brands_response = (
                    self.client.table("brand_event_summary")
                    .select("brand")
                    .execute()
                )
                for item in (brands_response.data or []):
                    if item.get("brand"):
                        all_brands.add(item["brand"])
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
    
    def count_events(
        self,
        sport: Optional[str] = None,
        event_type: Optional[str] = None,
        location: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> int:
        """Contar total de eventos com filtros (suporta múltiplos valores separados por vírgula)"""
        try:
            query = self.client.table("events").select("id", count="exact")
            
            # Aplicar filtros (suporta múltiplos valores separados por vírgula)
            query = self._apply_event_filters(query, sport, event_type, location, date_from, date_to)
            
            response = query.execute()
            return response.count if hasattr(response, 'count') else len(response.data or [])
        except Exception as e:
            print(f"Erro ao contar eventos: {e}")
            return 0
    
    def get_brand_time_series(
        self,
        sport: Optional[str] = None,
        event_type: Optional[str] = None,
        location: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        brand: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Buscar dados de marcas agregados por evento com data e filtros
        Retorna dados da view brand_event_summary com informações de data
        """
        try:
            # Se há filtros de evento, primeiro buscar os event_ids filtrados
            has_event_filters = any([sport, event_type, location, date_from, date_to])
            
            if has_event_filters:
                event_ids = self._get_filtered_event_ids(sport, event_type, location, date_from, date_to)
                if not event_ids:
                    return []
                
                # Buscar dados apenas dos eventos filtrados
                query = (
                    self.client.table("brand_event_summary")
                    .select("event_id, event_name, event_date, brand, total_items")
                    .in_("event_id", event_ids)
                )
            else:
                query = (
                    self.client.table("brand_event_summary")
                    .select("event_id, event_name, event_date, brand, total_items")
                )
            
            # Aplicar filtro de marca se fornecido
            if brand:
                brands = [b.strip() for b in brand.split(",")]
                if len(brands) > 1:
                    query = query.in_("brand", brands)
                else:
                    query = query.eq("brand", brands[0])
            
            response = query.order("event_date", desc=False).execute()
            
            return response.data or []
        except Exception as e:
            print(f"Erro ao buscar dados temporais de marcas: {e}")
            return []


# Instância global do serviço
db_service = DatabaseService()

