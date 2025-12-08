"""
Dependências para injeção nos endpoints
Facilita testes e manutenção
"""

from app.services.database import DatabaseService

# Instância global do serviço de banco
db_service = DatabaseService()


def get_db_service() -> DatabaseService:
    """Retorna instância do DatabaseService"""
    return db_service

