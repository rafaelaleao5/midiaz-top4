"""
Schemas Pydantic para geração de relatórios
Define os modelos de request e response para a API de relatórios
"""

from typing import Optional, List, Literal
from pydantic import BaseModel, Field
from datetime import date, datetime


# =============================================================================
# ENUMS E TIPOS
# =============================================================================

ReportType = Literal["market_share", "audience_segmentation", "event_metrics"]
ReportFocus = Literal["general", "brands", "products", "audience"]
SportType = Literal["corrida", "triathlon", "ciclismo", "vôlei", "futebol"]
ProductType = Literal["tênis", "camiseta", "short", "óculos", "boné"]
BrandName = Literal["Nike", "Adidas", "Mizuno", "Track&Field", "Asics", "Olympikus"]


# =============================================================================
# REQUEST SCHEMAS
# =============================================================================

class MarketShareFilters(BaseModel):
    """Filtros para relatório de Market Share"""
    date_from: date = Field(..., description="Data inicial do período")
    date_to: date = Field(..., description="Data final do período")
    sport: Optional[str] = Field(None, description="Filtrar por esporte")
    location: Optional[str] = Field(None, description="Filtrar por localização")
    product_type: Optional[str] = Field(None, description="Filtrar por tipo de produto")
    brands: Optional[List[str]] = Field(None, description="Marcas específicas para analisar")


class AudienceSegmentationFilters(BaseModel):
    """Filtros para relatório de Segmentação de Público"""
    date_from: date = Field(..., description="Data inicial do período")
    date_to: date = Field(..., description="Data final do período")
    sport: Optional[str] = Field(None, description="Filtrar por esporte")
    location: Optional[str] = Field(None, description="Filtrar por localização")
    product_type: Optional[str] = Field(None, description="Filtrar por tipo de produto")


class EventMetricsFilters(BaseModel):
    """Filtros para relatório de Métricas do Evento"""
    event_id: str = Field(..., description="ID do evento")
    focus: ReportFocus = Field("general", description="Foco do relatório")


class GenerateReportRequest(BaseModel):
    """Request para gerar um relatório"""
    type: ReportType = Field(..., description="Tipo de relatório")
    filters: dict = Field(..., description="Filtros específicos do tipo de relatório")
    
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "type": "market_share",
                    "filters": {
                        "date_from": "2025-01-01",
                        "date_to": "2025-01-31",
                        "sport": "corrida",
                        "brands": ["Nike", "Adidas"]
                    }
                },
                {
                    "type": "event_metrics",
                    "filters": {
                        "event_id": "550e8400-e29b-41d4-a716-446655440000",
                        "focus": "brands"
                    }
                }
            ]
        }


# =============================================================================
# RESPONSE SCHEMAS
# =============================================================================

class ReportMetadata(BaseModel):
    """Metadados do relatório gerado"""
    total_events: int = Field(..., description="Total de eventos analisados")
    total_athletes: int = Field(..., description="Total de atletas identificados")
    total_items: int = Field(..., description="Total de itens detectados")
    tokens_used: int = Field(..., description="Tokens consumidos pela LLM")
    model: str = Field(..., description="Modelo LLM utilizado")
    generation_time_ms: int = Field(..., description="Tempo de geração em milissegundos")


class GenerateReportResponse(BaseModel):
    """Response da geração de relatório"""
    type: ReportType = Field(..., description="Tipo de relatório")
    generated_at: datetime = Field(..., description="Data/hora de geração")
    filters_applied: dict = Field(..., description="Filtros aplicados")
    title: str = Field(..., description="Título do relatório")
    content: str = Field(..., description="Conteúdo do relatório em texto")
    metadata: ReportMetadata = Field(..., description="Metadados do relatório")
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "market_share",
                "generated_at": "2025-01-09T16:00:00Z",
                "filters_applied": {
                    "date_from": "2025-01-01",
                    "date_to": "2025-01-31",
                    "sport": "corrida"
                },
                "title": "Relatório de Market Share - Janeiro 2025",
                "content": "Nike consolida liderança no mercado de tênis de corrida...",
                "metadata": {
                    "total_events": 5,
                    "total_athletes": 1200,
                    "total_items": 3500,
                    "tokens_used": 847,
                    "model": "gpt-4o-mini",
                    "generation_time_ms": 2340
                }
            }
        }


# =============================================================================
# DATA SCHEMAS (para estruturar dados antes de enviar ao prompt)
# =============================================================================

class BrandRankingItem(BaseModel):
    """Item do ranking de marcas"""
    brand: str
    items: int
    share_percent: float
    persons_count: int


class ProductDistributionItem(BaseModel):
    """Item da distribuição de produtos"""
    product_type: str
    items: int
    percent: float


class AgeDistributionItem(BaseModel):
    """Item da distribuição por idade"""
    age_range: str
    count: int
    percent: float


class GenderDistribution(BaseModel):
    """Distribuição por gênero"""
    male_count: int
    male_percent: float
    female_count: int
    female_percent: float


class BrandBySegmentItem(BaseModel):
    """Preferência de marca por segmento"""
    segment: str
    brands: List[BrandRankingItem]


class MarketShareData(BaseModel):
    """Dados estruturados para relatório de Market Share"""
    period_start: date
    period_end: date
    filters_applied: dict
    total_events: int
    total_athletes: int
    total_items: int
    brand_ranking: List[BrandRankingItem]
    product_distribution: List[ProductDistributionItem]


class AudienceSegmentationData(BaseModel):
    """Dados estruturados para relatório de Segmentação de Público"""
    period_start: date
    period_end: date
    filters_applied: dict
    total_events: int
    total_athletes: int
    gender_distribution: GenderDistribution
    age_distribution: List[AgeDistributionItem]
    avg_age: float
    brand_by_segment: List[BrandBySegmentItem]


class EventMetricsData(BaseModel):
    """Dados estruturados para relatório de Métricas do Evento"""
    event_id: str
    event_name: str
    event_type: str
    sport: str
    event_date: date
    event_location: str
    focus: ReportFocus
    total_athletes: int
    total_photos: int
    total_items: int
    brand_ranking: List[BrandRankingItem]
    product_distribution: List[ProductDistributionItem]
    gender_distribution: GenderDistribution
    avg_age: float

