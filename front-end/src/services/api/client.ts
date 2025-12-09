/**
 * Cliente HTTP para comunicação com a API
 * Configuração centralizada de requisições
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

/**
 * Cliente HTTP simples usando fetch
 * Suporta query parameters e tratamento de erros
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Construir URL com query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  // Configurações padrão
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: `Erro HTTP: ${response.status} ${response.statusText}`,
      }));
      throw new Error(errorData.detail || `Erro: ${response.status}`);
    }

    // Se a resposta estiver vazia, retorna objeto vazio
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (error) {
    if (error instanceof Error) {
      // Melhorar mensagem de erro para "Failed to fetch"
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error(
          `Não foi possível conectar ao backend. Verifique se o servidor está rodando em ${API_BASE_URL}`
        );
      }
      throw error;
    }
    throw new Error('Erro desconhecido ao fazer requisição');
  }
}

/**
 * Métodos HTTP auxiliares
 */
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number>) =>
    apiClient<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, data?: unknown) =>
    apiClient<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    apiClient<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: 'DELETE' }),
};

