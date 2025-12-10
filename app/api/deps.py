"""
Dependências para injeção nos endpoints
Facilita testes e manutenção
"""

from typing import Optional
from app.services.database import DatabaseService
from app.services.openai_service import OpenAIService
from app.config import settings

# Instância global do serviço de banco
db_service = DatabaseService()

# Instância global do serviço OpenAI (None se não configurado)
openai_service: Optional[OpenAIService] = None
if settings.OPENAI_API_KEY:
    try:
        openai_service = OpenAIService()
    except Exception:
        openai_service = None


def get_db_service() -> DatabaseService:
    """Retorna instância do DatabaseService"""
    return db_service


def get_openai_service() -> Optional[OpenAIService]:
    """Retorna instância do OpenAIService ou None se não configurado"""
    return openai_service

