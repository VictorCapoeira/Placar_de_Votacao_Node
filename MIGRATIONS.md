# Sistema de Migrations - Placar de Votação

Este projeto agora possui um sistema de migrations similar ao Entity Framework do ASP.NET, permitindo criar e gerenciar o banco de dados de forma programática.

## 🚀 Como usar

### Inicializar o banco completo (Recomendado)
```bash
npm run db:init
```
Este comando executa as migrations (cria as tabelas) e os seeds (insere dados iniciais).

### Comandos individuais

#### Executar apenas as migrations (criar/atualizar tabelas)
```bash
npm run db:migrate
```

#### Executar apenas os seeds (inserir dados iniciais)
```bash
npm run db:seed
```

#### Verificar status das migrations
```bash
npm run db:status
```

#### Reverter última migration
```bash
npm run db:rollback
```

## 📁 Estrutura de arquivos

```
├── knexfile.js              # Configuração do Knex (conexão com BD)
├── migrate.js               # Script principal de migrations
├── migrations/              # Pasta com arquivos de migration
│   └── 001_create_sistema_votos_tables.js
└── seeds/                   # Pasta com dados iniciais
    └── 001_initial_data.js
```

## 🗃️ Estrutura do Banco

O sistema cria as seguintes tabelas:

- **usuario**: Armazena CPFs dos usuários
- **turno**: Matutino, Vespertino, Noturno
- **turma**: Informações das turmas e projetos
- **votos**: Relaciona usuários com turmas votadas

## 🔧 Configuração

As configurações de conexão estão no arquivo `knexfile.js` e utilizam as mesmas variáveis de ambiente do projeto:

- `DB_HOST` (padrão: localhost)
- `DB_USER` (padrão: root)
- `DB_PASSWORD` (padrão: 1234)
- `DB_NAME` (padrão: sistema_de_votos)

## ⚡ Uso programático

Você também pode usar as migrations diretamente no código:

```javascript
const { initializeDatabase, runMigrations } = require('./migrate');

// Inicializar banco completo
await initializeDatabase();

// Ou executar apenas migrations
await runMigrations();
```

## 📊 Dados iniciais inclusos

O sistema já vem com dados de exemplo:
- 3 turnos (Matutino, Vespertino, Noturno)
- 10 turmas com projetos diversos
- Professores e descrições dos projetos

## 🔄 Vantagens das Migrations

1. **Versionamento**: Controle de versões do banco de dados
2. **Colaboração**: Todos da equipe têm o mesmo schema
3. **Deploy**: Atualizações automáticas em produção
4. **Rollback**: Possibilidade de reverter alterações
5. **Reprodutibilidade**: Mesmo ambiente em dev/test/prod