# Implementação do Sistema de Imagens por Código de Turma

## Resumo das Mudanças

Foi implementada uma mudança no sistema de carregamento de imagens das turmas. Agora, as **imagens são organizadas em pastas nomeadas com o `codigo_turma`** do banco de dados, em vez do `id_turma` numérico.

## Como Funciona

### Estrutura de Pastas
Antes:
```
public/imagens/
├── turma1/           # ID da turma
├── turma2/
└── turma3/
```

Agora:
```
public/imagens/
├── ENG-01/           # Código da turma
├── MED-02/
├── DIR-03/
└── [outros códigos]/
```

### Busca de Imagens
A função `getImagensParaTurma()` foi modificada para:

1. **Buscar primeiro por código de turma** (novo comportamento):
   - `ENG-01` (exato)
   - `eng-01` (minúsculo)
   - `ENG-01` (maiúsculo)
   - `ENG01` (sem hífen)

2. **Manter compatibilidade** com o sistema antigo:
   - `turma1`, `turma01`, `t1`, `1` (se `id_turma` for fornecido)

3. **Busca na pasta raiz** como fallback:
   - Arquivos nomeados com o código da turma

## Modificações no Código

### 1. Função `getImagensParaTurma()`
- **Parâmetros**: `getImagensParaTurma(codigoTurma, turmaId = null)`
  - `codigoTurma`: String com o código da turma (ex: "ENG-01")
  - `turmaId`: Número do ID da turma (opcional, para compatibilidade)

### 2. Endpoint `/api/turmas`
- Modificado para usar `codigo_turma` na busca de imagens
- Mantém compatibilidade passando também o `id_turma`

## Vantagens

1. **Organização mais clara**: Pastas nomeadas com códigos descritivos
2. **Flexibilidade**: Suporte a códigos alfanuméricos complexos
3. **Compatibilidade**: Sistema antigo continua funcionando
4. **Escalabilidade**: Fácil adição de novas turmas com códigos únicos

## Exemplos de Uso

### Turmas do Banco de Dados
```sql
-- Exemplos de código_turma
ENG-01  -> pasta: public/imagens/ENG-01/
MED-02  -> pasta: public/imagens/MED-02/
DIR-03  -> pasta: public/imagens/DIR-03/
INFO-2024-A -> pasta: public/imagens/INFO-2024-A/
```

### Estrutura de Pasta por Turma
```
public/imagens/ENG-01/
├── projeto-ponte.jpg
├── equipe-engenharia.png
├── apresentacao.webp
└── banner-evento.svg
```

### Resposta da API
```json
{
  "id": 1,
  "code": "ENG-01",
  "name": "Turma de Engenharia",
  "description": "Projeto de ponte sustentável...",
  "teacher": "Prof. Carlos Silva",
  "images": [
    "/imagens/ENG-01/projeto-ponte.jpg",
    "/imagens/ENG-01/equipe-engenharia.png",
    "/imagens/ENG-01/apresentacao.webp",
    "/imagens/ENG-01/banner-evento.svg"
  ],
  "imageSource": "local"
}
```

## Migração

Para migrar do sistema antigo:

1. **Criar pastas com códigos de turma**:
   ```bash
   mkdir public/imagens/ENG-01
   mkdir public/imagens/MED-02
   # etc...
   ```

2. **Mover imagens das pastas antigas**:
   ```bash
   # Exemplo
   mv public/imagens/turma1/* public/imagens/ENG-01/
   mv public/imagens/turma2/* public/imagens/MED-02/
   ```

3. **Sistema funcionará automaticamente** com a nova estrutura

## Notas Técnicas

- A busca para quando encontra o primeiro match (evita duplicatas)
- Suporte a extensões: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`, `.svg`
- Log detalhado para debug no console do servidor
- Fallback para placeholder se nenhuma imagem for encontrada
- Busca case-insensitive e com/sem separadores