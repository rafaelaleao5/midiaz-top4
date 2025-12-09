"""
Rotas de eventos e métricas
Todas as rotas da API estão aqui (simplificado para MVP)
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.api.deps import get_db_service
from app.services.database import DatabaseService
from app.core.events import EventsService

router = APIRouter()


@router.get("/events")
async def list_events(
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de eventos a retornar"),
    offset: int = Query(0, ge=0, description="Número de eventos a pular"),
    db: DatabaseService = Depends(get_db_service)
):
    """
    Lista todos os eventos com paginação
    
    - **limit**: Número máximo de eventos (1-1000, padrão: 100)
    - **offset**: Número de eventos a pular (padrão: 0)
    
    Retorna lista de eventos ordenados por data (mais recentes primeiro)
    """
    try:
        events_service = EventsService(db)
        result = events_service.list_events(limit=limit, offset=offset)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar eventos: {str(e)}")


@router.get("/events/{event_id}")
async def get_event(
    event_id: str,
    db: DatabaseService = Depends(get_db_service)
):
    """
    Busca detalhes de um evento específico
    
    - **event_id**: UUID do evento
    
    Retorna informações completas do evento (nome, data, localização, etc)
    """
    try:
        events_service = EventsService(db)
        event = events_service.get_event_details(event_id)
        
        if not event:
            raise HTTPException(status_code=404, detail=f"Evento {event_id} não encontrado")
        
        return event
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar evento: {str(e)}")


@router.get("/events/{event_id}/brands")
async def get_event_brands(
    event_id: str,
    db: DatabaseService = Depends(get_db_service)
):
    """
    Retorna resumo de marcas de um evento
    
    - **event_id**: UUID do evento
    
    Retorna lista de marcas detectadas no evento, ordenadas por share (maior para menor)
    Inclui: brand, brand_share_percent, persons_with_brand, total_items
    """
    try:
        # Verificar se evento existe
        events_service = EventsService(db)
        event = events_service.get_event_details(event_id)
        
        if not event:
            raise HTTPException(status_code=404, detail=f"Evento {event_id} não encontrado")
        
        # Buscar marcas
        brands = events_service.get_event_brands(event_id)
        return {"event_id": event_id, "brands": brands}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar marcas do evento: {str(e)}")


@router.get("/events/{event_id}/products")
async def get_event_products(
    event_id: str,
    db: DatabaseService = Depends(get_db_service)
):
    """
    Retorna resumo de produtos de um evento
    
    - **event_id**: UUID do evento
    
    Retorna lista de tipos de produtos detectados no evento, ordenados por share (maior para menor)
    Inclui: product_type, product_share_percent, persons_with_product, total_items
    """
    try:
        # Verificar se evento existe
        events_service = EventsService(db)
        event = events_service.get_event_details(event_id)
        
        if not event:
            raise HTTPException(status_code=404, detail=f"Evento {event_id} não encontrado")
        
        # Buscar produtos
        products = events_service.get_event_products(event_id)
        return {"event_id": event_id, "products": products}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar produtos do evento: {str(e)}")


@router.get("/metrics/dashboard")
async def get_dashboard_metrics(
    db: DatabaseService = Depends(get_db_service)
):
    """
    Retorna KPIs agregados para o dashboard
    
    Retorna métricas gerais do sistema:
    - total_events: Total de eventos processados
    - total_photos_analyzed: Total de fotos analisadas
    - total_athletes_identified: Total de atletas identificados
    - total_brands_tracked: Total de marcas rastreadas
    - avg_accuracy: Precisão média do modelo
    - avg_processing_time: Tempo médio de processamento
    """
    try:
        events_service = EventsService(db)
        metrics = events_service.get_dashboard_metrics()
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar métricas do dashboard: {str(e)}")

