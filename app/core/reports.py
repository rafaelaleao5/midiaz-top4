"""
Lógica de negócio para geração de relatórios com LLM
Orquestra coleta de dados, construção de prompts e geração de texto
"""

import os
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime
import yaml

from app.services.database import DatabaseService
from app.services.openai_service import OpenAIService
from app.schemas.reports import (
    MarketShareFilters,
    AudienceSegmentationFilters,
    EventMetricsFilters,
    GenerateReportResponse,
    ReportMetadata,
)


# =============================================================================
# CARREGADOR DE PROMPTS
# =============================================================================

class PromptLoader:
    """Carrega e gerencia prompts do arquivo YAML"""
    
    _instance = None
    _prompts = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._prompts is None:
            self._load_prompts()
    
    def _load_prompts(self):
        """Carrega prompts do arquivo YAML"""
        prompts_path = Path(__file__).parent.parent / "prompts" / "reports.yaml"
        
        if not prompts_path.exists():
            raise FileNotFoundError(f"Arquivo de prompts não encontrado: {prompts_path}")
        
        with open(prompts_path, "r", encoding="utf-8") as f:
            self._prompts = yaml.safe_load(f)
    
    def get_system_prompt(self, report_type: str) -> str:
        """Retorna o prompt de sistema para um tipo de relatório"""
        return self._prompts[report_type]["system"]
    
    def get_user_prompt_template(self, report_type: str) -> str:
        """Retorna o template do prompt do usuário"""
        return self._prompts[report_type]["user"]
    
    def get_focus_instruction(self, focus: str) -> str:
        """Retorna a instrução específica para um foco de relatório"""
        return self._prompts["focus_instructions"].get(focus, "")


# Instância global do loader
prompt_loader = PromptLoader()


# =============================================================================
# SERVIÇO DE RELATÓRIOS
# =============================================================================

class ReportsService:
    """Serviço de geração de relatórios com LLM"""
    
    def __init__(self, db_service: DatabaseService, openai_service: OpenAIService):
        self.db = db_service
        self.llm = openai_service
        self.prompts = prompt_loader
    
    # =========================================================================
    # MÉTODOS PÚBLICOS - Geração de Relatórios
    # =========================================================================
    
    def generate_market_share_report(self, filters: MarketShareFilters) -> GenerateReportResponse:
        """Gera relatório de Market Share"""
        # 1. Coletar dados do banco
        data = self._collect_market_share_data(filters)
        
        # 2. Construir prompts
        system_prompt = self.prompts.get_system_prompt("market_share")
        user_prompt = self._build_market_share_user_prompt(data, filters)
        
        # 3. Gerar texto com LLM
        llm_response = self.llm.generate_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.7
        )
        
        # 4. Montar resposta
        return GenerateReportResponse(
            type="market_share",
            generated_at=datetime.utcnow(),
            filters_applied=filters.model_dump(exclude_none=True),
            title=self._generate_market_share_title(filters),
            content=llm_response["content"],
            metadata=ReportMetadata(
                total_events=data["total_events"],
                total_athletes=data["total_athletes"],
                total_items=data["total_items"],
                tokens_used=llm_response["tokens_used"],
                model=llm_response["model"],
                generation_time_ms=llm_response["generation_time_ms"]
            )
        )
    
    def generate_audience_segmentation_report(
        self, filters: AudienceSegmentationFilters
    ) -> GenerateReportResponse:
        """Gera relatório de Segmentação de Público"""
        # 1. Coletar dados do banco
        data = self._collect_audience_data(filters)
        
        # 2. Construir prompts
        system_prompt = self.prompts.get_system_prompt("audience_segmentation")
        user_prompt = self._build_audience_user_prompt(data, filters)
        
        # 3. Gerar texto com LLM
        llm_response = self.llm.generate_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.7
        )
        
        # 4. Montar resposta
        return GenerateReportResponse(
            type="audience_segmentation",
            generated_at=datetime.utcnow(),
            filters_applied=filters.model_dump(exclude_none=True),
            title=self._generate_audience_title(filters),
            content=llm_response["content"],
            metadata=ReportMetadata(
                total_events=data["total_events"],
                total_athletes=data["total_athletes"],
                total_items=data["total_items"],
                tokens_used=llm_response["tokens_used"],
                model=llm_response["model"],
                generation_time_ms=llm_response["generation_time_ms"]
            )
        )
    
    def generate_event_metrics_report(
        self, filters: EventMetricsFilters
    ) -> GenerateReportResponse:
        """Gera relatório de Métricas do Evento"""
        # 1. Coletar dados do banco
        data = self._collect_event_data(filters)
        
        if not data:
            raise ValueError(f"Evento {filters.event_id} não encontrado")
        
        # 2. Construir prompts
        system_prompt = self.prompts.get_system_prompt("event_metrics")
        user_prompt = self._build_event_user_prompt(data, filters)
        
        # 3. Gerar texto com LLM
        llm_response = self.llm.generate_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.7
        )
        
        # 4. Montar resposta
        return GenerateReportResponse(
            type="event_metrics",
            generated_at=datetime.utcnow(),
            filters_applied=filters.model_dump(exclude_none=True),
            title=f"Métricas do Evento - {data['event_name']}",
            content=llm_response["content"],
            metadata=ReportMetadata(
                total_events=1,
                total_athletes=data["total_athletes"],
                total_items=data["total_items"],
                tokens_used=llm_response["tokens_used"],
                model=llm_response["model"],
                generation_time_ms=llm_response["generation_time_ms"]
            )
        )
    
    # =========================================================================
    # COLETA DE DADOS
    # =========================================================================
    
    def _collect_market_share_data(self, filters: MarketShareFilters) -> Dict[str, Any]:
        """Coleta dados do banco para relatório de Market Share"""
        date_from = filters.date_from.isoformat()
        date_to = filters.date_to.isoformat()
        
        events = self.db.get_events(
            limit=1000, offset=0,
            sport=filters.sport,
            location=filters.location,
            date_from=date_from,
            date_to=date_to
        )
        
        if not events:
            return {
                "total_events": 0,
                "total_athletes": 0,
                "total_items": 0,
                "brand_ranking": [],
                "product_distribution": []
            }
        
        event_ids = [e["id"] for e in events]
        brand_data = self._aggregate_brands_for_events(event_ids, filters.product_type, filters.brands)
        product_data = self._aggregate_products_for_events(event_ids)
        
        total_athletes = sum(e.get("total_athletes_estimated", 0) or 0 for e in events)
        total_items = sum(b["items"] for b in brand_data)
        
        return {
            "total_events": len(events),
            "total_athletes": total_athletes,
            "total_items": total_items,
            "brand_ranking": brand_data,
            "product_distribution": product_data
        }
    
    def _collect_audience_data(self, filters: AudienceSegmentationFilters) -> Dict[str, Any]:
        """Coleta dados do banco para relatório de Segmentação de Público"""
        date_from = filters.date_from.isoformat()
        date_to = filters.date_to.isoformat()
        
        events = self.db.get_events(
            limit=1000, offset=0,
            sport=filters.sport,
            location=filters.location,
            date_from=date_from,
            date_to=date_to
        )
        
        if not events:
            return {
                "total_events": 0,
                "total_athletes": 0,
                "total_items": 0,
                "gender_distribution": {"male": 0, "female": 0, "male_percent": 0, "female_percent": 0},
                "age_distribution": [],
                "avg_age": 0,
                "brand_by_segment": []
            }
        
        event_ids = [e["id"] for e in events]
        demographic_data = self._aggregate_demographics_for_events(event_ids)
        brand_by_segment = self._aggregate_brands_by_segment(event_ids, filters.product_type)
        
        total_athletes = sum(e.get("total_athletes_estimated", 0) or 0 for e in events)
        brand_data = self._aggregate_brands_for_events(event_ids, filters.product_type, None)
        total_items = sum(b["items"] for b in brand_data)
        
        return {
            "total_events": len(events),
            "total_athletes": total_athletes,
            "total_items": total_items,
            **demographic_data,
            "brand_by_segment": brand_by_segment
        }
    
    def _collect_event_data(self, filters: EventMetricsFilters) -> Optional[Dict[str, Any]]:
        """Coleta dados do banco para relatório de Métricas do Evento"""
        event = self.db.get_event_by_id(filters.event_id)
        
        if not event:
            return None
        
        brand_data = self._aggregate_brands_for_events([filters.event_id], None, None)
        product_data = self._aggregate_products_for_events([filters.event_id])
        demographic_data = self._aggregate_demographics_for_events([filters.event_id])
        
        total_items = sum(b["items"] for b in brand_data)
        
        return {
            "event_id": event["id"],
            "event_name": event["event_name"],
            "event_type": event["event_type"],
            "sport": event.get("sport", "N/A"),
            "event_date": event["event_date"],
            "event_location": event["event_location"],
            "total_athletes": event.get("total_athletes_estimated", 0) or 0,
            "total_photos": event.get("total_photos", 0) or 0,
            "total_items": total_items,
            "brand_ranking": brand_data,
            "product_distribution": product_data,
            **demographic_data
        }
    
    # =========================================================================
    # AGREGAÇÃO DE DADOS
    # =========================================================================
    
    def _aggregate_brands_for_events(
        self, event_ids: List[str],
        product_type: Optional[str] = None,
        brands_filter: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Agrega dados de marcas para múltiplos eventos"""
        brand_totals: Dict[str, Dict[str, int]] = {}
        
        for event_id in event_ids:
            brands = self.db.get_brand_summary(event_id)
            for b in brands:
                brand_name = b["brand"]
                if brands_filter and brand_name not in brands_filter:
                    continue
                if brand_name not in brand_totals:
                    brand_totals[brand_name] = {"items": 0, "persons": 0}
                brand_totals[brand_name]["items"] += b.get("total_items", 0)
                brand_totals[brand_name]["persons"] += b.get("persons_with_brand", 0)
        
        total_items = sum(b["items"] for b in brand_totals.values())
        
        result = []
        for brand, data in brand_totals.items():
            share = (data["items"] / total_items * 100) if total_items > 0 else 0
            result.append({
                "brand": brand,
                "items": data["items"],
                "share_percent": round(share, 1),
                "persons_count": data["persons"]
            })
        
        result.sort(key=lambda x: x["share_percent"], reverse=True)
        return result
    
    def _aggregate_products_for_events(self, event_ids: List[str]) -> List[Dict[str, Any]]:
        """Agrega dados de produtos para múltiplos eventos"""
        product_totals: Dict[str, int] = {}
        
        for event_id in event_ids:
            products = self.db.get_product_summary(event_id)
            for p in products:
                product_type = p["product_type"]
                if product_type not in product_totals:
                    product_totals[product_type] = 0
                product_totals[product_type] += p.get("total_items", 0)
        
        total = sum(product_totals.values())
        
        result = []
        for product, items in product_totals.items():
            percent = (items / total * 100) if total > 0 else 0
            result.append({
                "product_type": product,
                "items": items,
                "percent": round(percent, 1)
            })
        
        result.sort(key=lambda x: x["percent"], reverse=True)
        return result
    
    def _aggregate_demographics_for_events(self, event_ids: List[str]) -> Dict[str, Any]:
        """Agrega dados demográficos para múltiplos eventos"""
        male_count = 0
        female_count = 0
        ages: List[int] = []
        age_ranges = {"18-25": 0, "26-35": 0, "36-45": 0, "46+": 0}
        
        for event_id in event_ids:
            persons = self.db.get_persons_by_event(event_id, limit=10000)
            for p in persons:
                gender = p.get("gender", "")
                age = p.get("age", 0)
                
                if gender == "M":
                    male_count += 1
                elif gender == "F":
                    female_count += 1
                
                if age:
                    ages.append(age)
                    if age <= 25:
                        age_ranges["18-25"] += 1
                    elif age <= 35:
                        age_ranges["26-35"] += 1
                    elif age <= 45:
                        age_ranges["36-45"] += 1
                    else:
                        age_ranges["46+"] += 1
        
        total = male_count + female_count
        avg_age = sum(ages) / len(ages) if ages else 0
        
        age_distribution = []
        for range_name, count in age_ranges.items():
            percent = (count / total * 100) if total > 0 else 0
            age_distribution.append({
                "age_range": range_name,
                "count": count,
                "percent": round(percent, 1)
            })
        
        return {
            "gender_distribution": {
                "male": male_count,
                "female": female_count,
                "male_percent": round((male_count / total * 100) if total > 0 else 0, 1),
                "female_percent": round((female_count / total * 100) if total > 0 else 0, 1)
            },
            "age_distribution": age_distribution,
            "avg_age": round(avg_age, 1)
        }
    
    def _aggregate_brands_by_segment(
        self, event_ids: List[str],
        product_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Agrega preferência de marca por segmento demográfico"""
        segments: Dict[str, Dict[str, int]] = {
            "Homens 18-35": {},
            "Homens 36+": {},
            "Mulheres 18-35": {},
            "Mulheres 36+": {}
        }
        
        for event_id in event_ids:
            persons = self.db.get_persons_by_event(event_id, limit=10000)
            items = self.db.get_items_by_event(event_id, limit=50000)
            
            person_map = {p["person_id"]: {"gender": p.get("gender", ""), "age": p.get("age", 0)} for p in persons}
            
            for item in items:
                person_id = item.get("person_id")
                brand = item.get("brand")
                
                if not person_id or not brand:
                    continue
                if product_type and item.get("product_type") != product_type:
                    continue
                
                person = person_map.get(person_id, {})
                gender = person.get("gender", "")
                age = person.get("age", 0)
                
                if gender == "M":
                    segment = "Homens 18-35" if age <= 35 else "Homens 36+"
                elif gender == "F":
                    segment = "Mulheres 18-35" if age <= 35 else "Mulheres 36+"
                else:
                    continue
                
                if brand not in segments[segment]:
                    segments[segment][brand] = 0
                segments[segment][brand] += 1
        
        result = []
        for segment, brands in segments.items():
            total = sum(brands.values())
            if total == 0:
                continue
            
            brand_list = []
            for brand, count in sorted(brands.items(), key=lambda x: x[1], reverse=True)[:5]:
                brand_list.append({
                    "brand": brand,
                    "items": count,
                    "share_percent": round((count / total * 100), 1),
                    "persons_count": 0
                })
            
            result.append({"segment": segment, "brands": brand_list})
        
        return result
    
    # =========================================================================
    # CONSTRUÇÃO DE PROMPTS (usando templates do YAML)
    # =========================================================================
    
    def _build_market_share_user_prompt(self, data: Dict[str, Any], filters: MarketShareFilters) -> str:
        """Constrói o prompt do usuário para Market Share"""
        template = self.prompts.get_user_prompt_template("market_share")
        
        # Formatar filtros
        filters_lines = []
        if filters.sport:
            filters_lines.append(f"Esporte: {filters.sport}")
        if filters.location:
            filters_lines.append(f"Local: {filters.location}")
        if filters.product_type:
            filters_lines.append(f"Produto: {filters.product_type}")
        if filters.brands:
            filters_lines.append(f"Marcas analisadas: {', '.join(filters.brands)}")
        filters_text = "\n".join(filters_lines) if filters_lines else "Nenhum filtro aplicado (análise geral)"
        
        # Formatar ranking
        brand_lines = []
        for i, b in enumerate(data["brand_ranking"][:10], 1):
            brand_lines.append(f"{i}. {b['brand']}: {b['share_percent']}% ({b['items']:,} itens, {b['persons_count']:,} pessoas)")
        brand_ranking = "\n".join(brand_lines) if brand_lines else "Nenhuma marca encontrada"
        
        # Formatar produtos
        product_lines = [f"- {p['product_type'].title()}: {p['percent']}% ({p['items']:,} itens)" for p in data["product_distribution"]]
        product_distribution = "\n".join(product_lines) if product_lines else "Nenhum produto encontrado"
        
        return template.format(
            period_start=filters.date_from.strftime('%d/%m/%Y'),
            period_end=filters.date_to.strftime('%d/%m/%Y'),
            filters_text=filters_text,
            total_events=data['total_events'],
            total_athletes=f"{data['total_athletes']:,}",
            total_items=f"{data['total_items']:,}",
            brand_ranking=brand_ranking,
            product_distribution=product_distribution
        )
    
    def _build_audience_user_prompt(self, data: Dict[str, Any], filters: AudienceSegmentationFilters) -> str:
        """Constrói o prompt do usuário para Segmentação de Público"""
        template = self.prompts.get_user_prompt_template("audience_segmentation")
        
        # Formatar filtros
        filters_lines = []
        if filters.sport:
            filters_lines.append(f"Esporte: {filters.sport}")
        if filters.location:
            filters_lines.append(f"Local: {filters.location}")
        if filters.product_type:
            filters_lines.append(f"Produto: {filters.product_type}")
        filters_text = "\n".join(filters_lines) if filters_lines else "Nenhum filtro aplicado (análise geral)"
        
        # Formatar gênero
        gender = data["gender_distribution"]
        gender_distribution = f"- Masculino: {gender['male_percent']}% ({gender['male']:,} pessoas)\n- Feminino: {gender['female_percent']}% ({gender['female']:,} pessoas)"
        
        # Formatar idade
        age_lines = [f"- {a['age_range']} anos: {a['percent']}% ({a['count']:,} pessoas)" for a in data["age_distribution"]]
        age_distribution = "\n".join(age_lines)
        
        # Formatar segmentos
        segment_lines = []
        for seg in data["brand_by_segment"]:
            brands_text = ", ".join([f"{b['brand']} ({b['share_percent']}%)" for b in seg["brands"][:3]])
            segment_lines.append(f"**{seg['segment']}**: {brands_text}")
        brand_by_segment = "\n".join(segment_lines) if segment_lines else "Dados insuficientes para segmentação"
        
        return template.format(
            period_start=filters.date_from.strftime('%d/%m/%Y'),
            period_end=filters.date_to.strftime('%d/%m/%Y'),
            filters_text=filters_text,
            total_events=data['total_events'],
            total_athletes=f"{data['total_athletes']:,}",
            total_items=f"{data['total_items']:,}",
            gender_distribution=gender_distribution,
            age_distribution=age_distribution,
            avg_age=data['avg_age'],
            brand_by_segment=brand_by_segment
        )
    
    def _build_event_user_prompt(self, data: Dict[str, Any], filters: EventMetricsFilters) -> str:
        """Constrói o prompt do usuário para Métricas do Evento"""
        template = self.prompts.get_user_prompt_template("event_metrics")
        
        # Formatar ranking
        brand_lines = [f"{i}. {b['brand']}: {b['share_percent']}% ({b['items']:,} itens)" for i, b in enumerate(data["brand_ranking"][:6], 1)]
        brand_ranking = "\n".join(brand_lines) if brand_lines else "Nenhuma marca detectada"
        
        # Formatar produtos
        product_lines = [f"- {p['product_type'].title()}: {p['percent']}%" for p in data["product_distribution"]]
        product_distribution = "\n".join(product_lines) if product_lines else "Nenhum produto detectado"
        
        # Formatar gênero
        gender = data["gender_distribution"]
        gender_info = f"Masculino: {gender['male_percent']}% | Feminino: {gender['female_percent']}%"
        
        # Mapear foco
        focus_map = {
            "general": "Visão geral (360°)",
            "brands": "Foco em marcas",
            "products": "Foco em produtos",
            "audience": "Foco em público"
        }
        focus_text = focus_map.get(filters.focus, "Visão geral")
        focus_instruction = self.prompts.get_focus_instruction(filters.focus)
        
        return template.format(
            event_name=data['event_name'],
            event_type=data['event_type'].title(),
            sport=data['sport'].title(),
            event_date=data['event_date'],
            event_location=data['event_location'],
            total_athletes=f"{data['total_athletes']:,}",
            total_photos=f"{data['total_photos']:,}",
            total_items=f"{data['total_items']:,}",
            brand_ranking=brand_ranking,
            product_distribution=product_distribution,
            gender_info=gender_info,
            avg_age=data['avg_age'],
            focus_text=focus_text,
            focus_instruction=focus_instruction
        )
    
    # =========================================================================
    # HELPERS
    # =========================================================================
    
    def _generate_market_share_title(self, filters: MarketShareFilters) -> str:
        """Gera título para relatório de Market Share"""
        parts = ["Relatório de Market Share"]
        if filters.sport:
            parts.append(f"- {filters.sport.title()}")
        if filters.location:
            parts.append(f"- {filters.location}")
        period = f"{filters.date_from.strftime('%b/%Y')} a {filters.date_to.strftime('%b/%Y')}"
        parts.append(f"({period})")
        return " ".join(parts)
    
    def _generate_audience_title(self, filters: AudienceSegmentationFilters) -> str:
        """Gera título para relatório de Segmentação de Público"""
        parts = ["Segmentação de Público"]
        if filters.sport:
            parts.append(f"- {filters.sport.title()}")
        if filters.location:
            parts.append(f"- {filters.location}")
        period = f"{filters.date_from.strftime('%b/%Y')} a {filters.date_to.strftime('%b/%Y')}"
        parts.append(f"({period})")
        return " ".join(parts)
