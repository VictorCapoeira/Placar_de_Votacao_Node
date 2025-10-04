# Exemplo Prático: Adicionando Nova Turma

## Cenário
Vamos adicionar uma nova turma de Informática com código "INFO-2024-A".

## Passo 1: Inserir no Banco de Dados
```sql
INSERT INTO turma (nome_turma, codigo_turma, projeto_turma, descricao_projeto_turma, fotos_turma, professor_turma) 
VALUES (
    'Turma de Informática 2024-A', 
    'INFO-2024-A', 
    'Sistema de Gestão Escolar', 
    'Desenvolvimento de um sistema completo para gestão de notas, frequência e comunicação entre escola e pais.',
    NULL, 
    'Prof. Maria Tecnologia'
);
```

## Passo 2: Criar Pasta de Imagens
```bash
# Criar pasta com o código da turma
mkdir "public/imagens/INFO-2024-A"
```

## Passo 3: Adicionar Imagens
Copie as imagens da turma para a pasta criada:
```
public/imagens/INFO-2024-A/
├── sistema-login.png
├── dashboard-principal.jpg
├── modulo-notas.webp
├── app-mobile.jpg
└── equipe-desenvolvimento.png
```

## Passo 4: Resultado Automático
O sistema automaticamente:

1. **Detecta a pasta** `INFO-2024-A`
2. **Carrega todas as imagens** da pasta
3. **Retorna na API** `/api/turmas`:

```json
{
  "id": 4,
  "code": "INFO-2024-A", 
  "name": "Turma de Informática 2024-A",
  "description": "Desenvolvimento de um sistema completo...",
  "teacher": "Prof. Maria Tecnologia",
  "images": [
    "/imagens/INFO-2024-A/app-mobile.jpg",
    "/imagens/INFO-2024-A/dashboard-principal.jpg", 
    "/imagens/INFO-2024-A/equipe-desenvolvimento.png",
    "/imagens/INFO-2024-A/modulo-notas.webp",
    "/imagens/INFO-2024-A/sistema-login.png"
  ],
  "imageSource": "local"
}
```

4. **Exibe no frontend** com carrossel de imagens

## Vantagens desta Abordagem

### ✅ Flexibilidade de Códigos
- `INFO-2024-A` é muito mais descritivo que apenas "4"
- Suporte a códigos complexos com letras, números e símbolos

### ✅ Organização Clara  
- Cada turma tem sua pasta própria
- Fácil de encontrar e gerenciar imagens

### ✅ Múltiplas Imagens
- Suporte automático a várias imagens por turma
- Carrossel automático no frontend

### ✅ Tipos de Arquivo Suportados
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`, `.svg`

## Fallbacks Automáticos

Se não encontrar a pasta `INFO-2024-A`, o sistema ainda tentará:

1. **Pastas alternativas**:
   - `info-2024-a` (minúsculo)
   - `INFO-2024-A` (maiúsculo) 
   - `INFO2024A` (sem hífen)

2. **Arquivos na raiz**:
   - `info-2024-a_projeto.jpg`
   - `INFO2024A.png`
   - etc.

3. **Placeholder**:
   - Se nada for encontrado, usa imagem placeholder com o nome da turma

## Teste Rápido

Para testar se está funcionando:

1. **Reinicie o servidor**: `node server.js`
2. **Acesse**: `http://localhost:3000/api/turmas`  
3. **Verifique** se as imagens aparecem corretamente no array `images`
4. **Teste o frontend**: `http://localhost:3000` e veja o carrossel