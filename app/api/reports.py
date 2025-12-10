"""
Rotas de geração de relatórios com LLM
Endpoints para gerar relatórios de Market Share, Segmentação e Métricas de Evento
"""

from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_db_service, get_openai_service
from app.services.database import DatabaseService
from app.services.openai_service import OpenAIService
from app.core.reports import ReportsService
from app.schemas.reports import (
    GenerateReportRequest,
    GenerateReportResponse,
    MarketShareFilters,
    AudienceSegmentationFilters,
    EventMetricsFilters,
)

router = APIRouter()


@router.post("/reports/generate", response_model=GenerateReportResponse)
async def generate_report(
    request: GenerateReportRequest,
    db: DatabaseService = Depends(get_db_service),
    openai: OpenAIService = Depends(get_openai_service)
):
    """
    Gera um relatório usando LLM com base nos filtros fornecidos
    
    ## Tipos de Relatório
    
    ### 1. Market Share (`market_share`)
    Análise de participação de mercado das marcas.
    
    **Filtros:**
    - `date_from` (obrigatório): Data inicial (YYYY-MM-DD)
    - `date_to` (obrigatório): Data final (YYYY-MM-DD)
    - `sport`: Filtrar por esporte
    - `location`: Filtrar por localização
    - `product_type`: Filtrar por tipo de produto
    - `brands`: Lista de marcas específicas para analisar
    
    ### 2. Segmentação de Público (`audience_segmentation`)
    Análise do perfil demográfico e preferências.
    
    **Filtros:**
    - `date_from` (obrigatório): Data inicial
    - `date_to` (obrigatório): Data final
    - `sport`: Filtrar por esporte
    - `location`: Filtrar por localização
    - `product_type`: Filtrar por tipo de produto
    
    ### 3. Métricas do Evento (`event_metrics`)
    Resumo executivo de um evento específico.
    
    **Filtros:**
    - `event_id` (obrigatório): UUID do evento
    - `focus`: Foco do relatório (general, brands, products, audience)
    """
    if openai is None:
        raise HTTPException(
            status_code=503,
            detail="Serviço de geração de relatórios não disponível. "
                   "Configure OPENAI_API_KEY no arquivo .env"
        )
    
    try:
        reports_service = ReportsService(db, openai)
        
        if request.type == "market_share":
            filters = MarketShareFilters(**request.filters)
            return reports_service.generate_market_share_report(filters)
        
        elif request.type == "audience_segmentation":
            filters = AudienceSegmentationFilters(**request.filters)
            return reports_service.generate_audience_segmentation_report(filters)
        
        elif request.type == "event_metrics":
            filters = EventMetricsFilters(**request.filters)
            return reports_service.generate_event_metrics_report(filters)
        
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de relatório inválido: {request.type}. "
                       f"Tipos válidos: market_share, audience_segmentation, event_metrics"
            )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao gerar relatório: {str(e)}"
        )


@router.get("/reports/status")
async def get_reports_status(
    openai: OpenAIService = Depends(get_openai_service)
):
    """
    Verifica se o serviço de relatórios está disponível
    
    Retorna:
    - available: true se OPENAI_API_KEY está configurada
    - model: modelo LLM que será utilizado
    """
    if openai is None:
        return {
            "available": False,
            "message": "OPENAI_API_KEY não configurada"
        }
    
    return {
        "available": True,
        "model": openai.model,
        "message": "Serviço de relatórios disponível"
    }

