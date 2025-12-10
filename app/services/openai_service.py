"""
Serviço de integração com OpenAI
Abstração sobre o cliente OpenAI para geração de texto com LLM
"""

import time
from typing import Optional
from openai import OpenAI
from app.config import settings


class OpenAIService:
    """Serviço para geração de texto usando OpenAI GPT"""
    
    def __init__(self):
        """Inicializa o cliente OpenAI"""
        if not settings.OPENAI_API_KEY:
            raise ValueError(
                "OPENAI_API_KEY não configurada. "
                "Adicione a chave no arquivo .env"
            )
        
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
        self.max_tokens = settings.OPENAI_MAX_TOKENS
    
    def generate_completion(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> dict:
        """
        Gera uma completion usando o modelo GPT
        
        Args:
            system_prompt: Prompt de sistema (define persona e contexto)
            user_prompt: Prompt do usuário (dados e tarefa)
            temperature: Criatividade (0.0-1.0, padrão 0.7)
            max_tokens: Limite de tokens na resposta
            
        Returns:
            dict com:
                - content: texto gerado
                - tokens_used: total de tokens consumidos
                - model: modelo utilizado
                - generation_time_ms: tempo de geração
        """
        start_time = time.time()
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens or self.max_tokens
            )
            
            generation_time_ms = int((time.time() - start_time) * 1000)
            
            return {
                "content": response.choices[0].message.content,
                "tokens_used": response.usage.total_tokens if response.usage else 0,
                "model": self.model,
                "generation_time_ms": generation_time_ms
            }
            
        except Exception as e:
            raise RuntimeError(f"Erro ao gerar texto com OpenAI: {str(e)}")
    
    def is_available(self) -> bool:
        """Verifica se o serviço está disponível"""
        return bool(settings.OPENAI_API_KEY)


# Instância global do serviço (será None se não houver API key)
def get_openai_service() -> Optional[OpenAIService]:
    """
    Retorna instância do OpenAIService ou None se não configurado
    Usado para injeção de dependência
    """
    if not settings.OPENAI_API_KEY:
        return None
    return OpenAIService()

