# Sistema de Controle de Acesso ao Placar

## Resumo das Mudanças

Foi implementado um sistema de controle de acesso que **restringe o acesso ao placar de votação apenas para o CPF administrativo `12345678912`**. Usuários comuns não têm mais acesso ao placar através de links públicos.

## Como Funciona

### 1. CPF Administrativo
- **CPF:** `12345678912`
- Este é o único CPF que pode acessar o placar de votação
- Pode votar normalmente E acessar o placar
- Aparece um badge "ADMIN" no menu quando autenticado

### 2. Controle de Acesso Implementado

#### **Página Principal (index.html)**
- ❌ **Link do placar removido** do menu público
- ✅ **Link do placar aparece apenas** para o CPF administrativo após verificação
- ✅ **Admin pode votar normalmente** e continuar usando o sistema

#### **Página de Bloqueio (blocked.html)**  
- ❌ **Botão "Ver Resultados" removido** para usuários comuns
- ❌ **Estilos CSS do botão removidos**

#### **Página do Placar (placar.html)**
- ✅ **Tela de autenticação** obrigatória antes de acessar
- ✅ **Validação de CPF** com formatação automática
- ✅ **Mensagens de erro** claras para acesso negado
- ✅ **Interface amigável** com ícones e design responsivo

#### **Backend (server.js)**
- ✅ **Endpoint `/api/placar`** protegido com autenticação
- ✅ **Verificação de CPF administrativo** antes de retornar dados
- ✅ **Logs de segurança** para tentativas não autorizadas
- ✅ **Novos endpoints** para verificar permissões

## Endpoints da API

### `/api/placar?cpf=CPF_ADMIN`
- **Antes:** Público, sem autenticação
- **Agora:** Requer CPF administrativo como query parameter
- **Retorna:** Dados do placar apenas para CPF `12345678912`

### `/api/check-cpf/:cpf`
- **Modificado:** Agora também retorna se é admin
- **Resposta inclui:**
  ```json
  {
    "hasVoted": false,
    "isAdmin": true,
    "canAccessPlacar": true
  }
  ```

### `/api/check-admin/:cpf` (NOVO)
- **Função:** Verifica especificamente se um CPF é administrativo
- **Uso:** Para validações rápidas de permissão

## Fluxo de Acesso ao Placar

### Para Usuários Comuns:
1. ❌ **Não veem link** do placar em lugar nenhum
2. ❌ **Acesso direto negado** se tentarem acessar `/placar.html`
3. ❌ **API retorna erro 403** se tentarem acessar `/api/placar`

### Para o Administrador:
1. ✅ **Informa CPF** na página principal
2. ✅ **Sistema detecta** que é admin e mostra link do placar
3. ✅ **Acessa placar.html** através do link especial
4. ✅ **Tela de autenticação** solicita CPF novamente
5. ✅ **Sistema valida** e libera acesso ao placar completo

## Segurança Implementada

### ✅ **Validação Dupla**
- Verificação no frontend (UX) 
- Validação obrigatória no backend (segurança)

### ✅ **Logs de Auditoria**
```
Console do servidor mostra:
- "Tentativa de acesso não autorizado ao placar com CPF: XXXXXXXXX"
- "Placar acessado pelo administrador (CPF: 12345678912)"
```

### ✅ **Mensagens de Erro Padronizadas**
- Não expõem informações sensíveis
- Fornecem feedback claro para o usuário

### ✅ **Interface Intuitiva**
- Formatação automática de CPF
- Validação em tempo real
- Loading states durante verificações

## Exemplo de Uso

### Acesso do Administrador:

1. **Na página principal:**
   ```
   CPF: 123.456.789-12
   → Sistema detecta admin
   → Aparece link "Placar [ADMIN]" no menu
   ```

2. **Na página do placar:**
   ```
   Tela: "Área Restrita - Informe CPF do Administrador"
   CPF: 123.456.789-12
   → Sistema valida e libera placar completo
   ```

### Tentativa de Acesso Não Autorizado:

1. **Usuário comum tenta acessar `/placar.html`:**
   ```
   Tela: "Área Restrita"
   CPF: 111.222.333-44
   → Erro: "Acesso negado. Apenas administradores..."
   ```

2. **Tentativa de acesso direto à API:**
   ```
   GET /api/placar?cpf=111222333444
   → 403 Forbidden
   → Log: "Tentativa de acesso não autorizado..."
   ```

## Compatibilidade

- ✅ **Sistema de votação** continua funcionando normalmente
- ✅ **Usuários comuns** votam sem perceber mudanças
- ✅ **Administrador** pode votar E acessar placar
- ✅ **Design responsivo** mantido em todas as telas
- ✅ **Performance** não foi impactada

## Manutenção

### Para Alterar o CPF Administrativo:
1. Modificar a constante `ADMIN_CPF` no `server.js`
2. Reiniciar o servidor
3. Novo CPF terá acesso automático

### Para Adicionar Mais Administradores:
1. Modificar a lógica de verificação para aceitar array de CPFs
2. Atualizar função de validação no backend
3. Testar com novos CPFs

## Testes Realizados

✅ **Usuário comum** - não vê links do placar  
✅ **Administrador** - vê link do placar após login  
✅ **Acesso direto negado** - URL `/placar.html` protegida  
✅ **API protegida** - endpoint `/api/placar` com autenticação  
✅ **Validação de CPF** - formatação e validação funcionando  
✅ **Logs de auditoria** - tentativas registradas no console  
✅ **Interface responsiva** - funciona em mobile e desktop