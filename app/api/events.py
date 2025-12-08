"""
Rotas de eventos e métricas
Todas as rotas da API estão aqui (simplificado para MVP)
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.api.deps import get_db_service
from app.services.database import DatabaseService

router = APIRouter()


@router.get("/events")
async def list_events(
    limit: int = 100,
    offset: int = 0,
    db: DatabaseService = Depends(get_db_service)
):
    """
    Lista todos os eventos com paginação
    """
    # TODO: Implementar na Task 5
    return {"message": "Not implemented yet"}


@router.get("/events/{event_id}")
async def get_event(
    event_id: str,
    db: DatabaseService = Depends(get_db_service)
):
    """
    Busca detalhes de um evento específico
    """
    # TODO: Implementar na Task 6
    return {"message": "Not implemented yet"}


@router.get("/events/{event_id}/brands")
async def get_event_brands(
    event_id: str,
    db: DatabaseService = Depends(get_db_service)
):
    """
    Retorna resumo de marcas de um evento
    """
    # TODO: Implementar na Task 7
    return {"message": "Not implemented yet"}


@router.get("/events/{event_id}/products")
async def get_event_products(
    event_id: str,
    db: DatabaseService = Depends(get_db_service)
):
    """
    Retorna resumo de produtos de um evento
    """
    # TODO: Implementar na Task 8
    return {"message": "Not implemented yet"}


@router.get("/metrics/dashboard")
async def get_dashboard_metrics(
    db: DatabaseService = Depends(get_db_service)
):
    """
    Retorna KPIs agregados para o dashboard
    """
    # TODO: Implementar na Task 9
    return {"message": "Not implemented yet"}

