"""
Exemplos de conexão com Supabase usando API REST
Esta é a abordagem recomendada para o MVP, pois funciona imediatamente
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# ============================================================================
# CONEXÃO COM SUPABASE (API REST)
# ============================================================================

def connect_supabase_client() -> Client:
    """
    Conectar usando Supabase Python Client (API REST)
    
    Returns:
        Client: Cliente Supabase configurado
        
    Raises:
        ValueError: Se SUPABASE_URL ou SUPABASE_ANON_KEY não estiverem configurados
    """
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError(
            "SUPABASE_URL e SUPABASE_ANON_KEY devem estar configurados no .env"
        )
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase

# ============================================================================
# EXEMPLOS PRÁTICOS
# ============================================================================

def listar_eventos():
    """Listar todos os eventos"""
    supabase = connect_supabase_client()
    response = supabase.table("events").select("*").execute()
    return response.data

def buscar_pessoas_por_evento(event_id: str):
    """Buscar pessoas de um evento específico"""
    supabase = connect_supabase_client()
    response = (
        supabase.table("event_persons")
        .select("*")
        .eq("event_id", event_id)
        .execute()
    )
    return response.data

def buscar_share_marcas(event_id: str):
    """Buscar share de marcas de um evento (usando view materializada)"""
    supabase = connect_supabase_client()
    response = (
        supabase.table("brand_event_summary")
        .select("*")
        .eq("event_id", event_id)
        .order("brand_share_percent", desc=True)
        .execute()
    )
    return response.data

def buscar_itens_por_pessoa(person_id: str, event_id: str = None):
    """Buscar itens de uma pessoa específica"""
    supabase = connect_supabase_client()
    query = supabase.table("person_items").select("*").eq("person_id", person_id)
    
    if event_id:
        query = query.eq("event_id", event_id)
    
    response = query.execute()
    return response.data

def buscar_produtos_especificos(event_id: str = None):
    """Buscar produtos com product_name preenchido (produtos treinados)"""
    supabase = connect_supabase_client()
    query = (
        supabase.table("person_items")
        .select("*, events(event_name)")
        .not_.is_("product_name", "null")
    )
    
    if event_id:
        query = query.eq("event_id", event_id)
    
    response = query.execute()
    return response.data

# ============================================================================
# TESTE DE CONEXÃO
# ============================================================================

if __name__ == "__main__":
    print("🧪 Testando conexão com Supabase...\n")
    
    try:
        # Teste 1: Listar eventos
        print("1️⃣ Listando eventos...")
        eventos = listar_eventos()
        print(f"   ✅ Encontrados {len(eventos)} eventos")
        for event in eventos:
            print(f"      - {event['event_name']} ({event['event_type']})")
        
        # Teste 2: Contar pessoas
        print("\n2️⃣ Contando pessoas...")
        supabase = connect_supabase_client()
        response = supabase.table("event_persons").select("id", count="exact").limit(1).execute()
        print(f"   ✅ Total de pessoas: {response.count}")
        
        # Teste 3: Contar itens
        print("\n3️⃣ Contando itens...")
        response = supabase.table("person_items").select("id", count="exact").limit(1).execute()
        print(f"   ✅ Total de itens: {response.count}")
        
        # Teste 4: Share de marcas
        print("\n4️⃣ Consultando share de marcas...")
        if eventos:
            event_id = eventos[0]["id"]
            marcas = buscar_share_marcas(event_id)
            print(f"   ✅ Encontradas {len(marcas)} marcas no resumo")
            for brand in marcas[:3]:
                print(f"      - {brand['brand']}: {brand['brand_share_percent']}% share")
        
        # Teste 5: Produtos específicos
        print("\n5️⃣ Buscando produtos específicos (com product_name)...")
        produtos = buscar_produtos_especificos()
        print(f"   ✅ Encontrados {len(produtos)} produtos específicos")
        if produtos:
            # Agrupar por marca e produto
            from collections import Counter
            combinacoes = Counter(
                (p['brand'], p['product_name']) 
                for p in produtos 
                if p.get('product_name')
            )
            print("   Top 3 combinações:")
            for (brand, product), count in combinacoes.most_common(3):
                print(f"      - {brand} {product}: {count} ocorrências")
        
        print("\n✅ Todos os testes passaram!")
        print("💡 Conexão com Supabase funcionando perfeitamente via API REST")
        
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        print("\n💡 Verifique:")
        print("   - Arquivo .env existe e está configurado?")
        print("   - SUPABASE_URL e SUPABASE_ANON_KEY estão corretos?")
        print("   - Projeto Supabase está ativo?")
