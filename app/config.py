"""
Configurações da aplicação
Centraliza todas as variáveis de ambiente e settings
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configurações da aplicação carregadas do .env"""
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_KEY: Optional[str] = None
    
    # Database (opcional - usando API REST principalmente)
    DATABASE_URL: Optional[str] = None
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_TITLE: str = "Midiaz B2B - Event Brand Report API"
    API_VERSION: str = "1.0.0"
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignora campos extras no .env


# Instância global de settings
settings = Settings()

