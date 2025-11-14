# 🏆 Sistema de Votação - Feira de Profissões SENAC

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## 📋 Sobre o Projeto

O **Sistema de Votação da Feira de Profissões SENAC** é uma aplicação web moderna desenvolvida para gerenciar e organizar votações em feiras de apresentação de projetos acadêmicos. O sistema permite que visitantes votem em seus projetos favoritos de diferentes cursos técnicos, oferecendo uma interface intuitiva e um painel administrativo completo para acompanhamento em tempo real dos resultados.

### 🎯 Características Principais

- **Votação Digital**: Interface responsiva e intuitiva para votação em projetos
- **Autenticação por CPF**: Validação de CPF com algoritmo brasileiro oficial
- **Prevenção de Fraudes**: Sistema que impede múltiplas votações do mesmo CPF
- **Gestão de Turnos**: Controle administrativo para votação por turnos (Matutino, Vespertino, Noturno)
- **Placar em Tempo Real**: Dashboard administrativo com estatísticas detalhadas
- **Modo Fallback**: Sistema resiliente com funcionamento em memória quando banco indisponível
- **Galeria de Imagens**: Suporte para visualização de projetos com imagens organizadas por turma

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **MySQL2** - Driver MySQL com suporte a Promises
- **Knex.js** - Query builder e migrations

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com variáveis CSS
- **Bootstrap 5** - Framework CSS responsivo
- **Bootstrap Icons** - Ícones vetoriais
- **JavaScript ES6+** - Funcionalidades interativas

### DevOps & Database
- **MySQL** - Banco de dados relacional
- **Nodemon** - Desenvolvimento com hot reload
- **Git** - Controle de versão

## 🏗️ Arquitetura do Sistema

```
├── public/                 # Interface do usuário (Frontend)
│   ├── index.html         # Página principal de votação
│   ├── dashboard.html     # Painel administrativo
│   ├── placar.html        # Visualização do placar
│   ├── blocked.html       # Página de acesso negado
│   └── imagens/           # Galeria de projetos por turma
├── db/                    # Scripts de banco de dados
│   ├── ddl.sql           # Definição da estrutura
│   ├── dml.sql           # Dados iniciais
│   └── schema.sql        # Schema completo
├── migrations/           # Migrações do banco
│   └── 001_create_sistema_votos_tables.js
├── seeds/               # Dados de exemplo
│   └── 001_initial_data.js
├── server.js           # Servidor principal
├── migrate.js          # Script de migração
└── knexfile.js        # Configuração do Knex
```

## 📊 Funcionalidades Detalhadas

### Para Usuários (Votantes)
- ✅ Validação de CPF em tempo real
- ✅ Visualização de projetos com imagens e descrições
- ✅ Interface responsiva para dispositivos móveis
- ✅ Feedback visual imediato após votação
- ✅ Prevenção de votação duplicada

### Para Administradores
- 🛡️ Acesso protegido por CPF administrativo
- 📈 Dashboard com estatísticas em tempo real
- 🎛️ Controle de turnos ativos para votação
- 📊 Placar de resultados com filtros por turno
- 🔄 Monitoramento do status do sistema

### Características Técnicas
- 🔄 **Alta Disponibilidade**: Modo fallback em memória
- 🔒 **Segurança**: Validação de entrada e prevenção de SQL injection
- ⚡ **Performance**: Pool de conexões e queries otimizadas
- 📱 **Responsividade**: Design mobile-first
- 🛠️ **Manutenibilidade**: Código modular e bem documentado

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js >= 18.0.0
- MySQL >= 5.7
- npm >= 8.0.0

### 1. Clone o Repositório
```bash
git clone https://github.com/VictorCapoeira/Placar_de_Votacao_Node.git
cd Placar_de_Votacao_Node
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env` ou configure as variáveis:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=sistema_de_votos
PORT=3000
```

### 4. Inicialize o Banco de Dados
```bash
# Executar migrações e seeds
npm run db:migrate
npm run db:seed

# Ou inicialização completa
npm run db:init
```

### 5. Execute o Projeto
```bash
# Desenvolvimento com hot reload
npm run dev

# Produção
npm start
```

## 🎮 Como Usar

### Acesso do Público
1. Acesse `http://localhost:3000`
2. Digite um CPF válido
3. Escolha o projeto para votar
4. Confirme sua votação

### Acesso Administrativo
1. Use o CPF administrativo configurado
2. Acesse o dashboard para:
   - Visualizar estatísticas em tempo real
   - Controlar turnos ativos
   - Monitorar resultados por turno
   - Verificar status do sistema

## 🎨 Cursos e Projetos Suportados

O sistema suporta projetos de diversos cursos técnicos:
- **Enfermagem** - Saúde e Tecnologia
- **Desenvolvimento de Sistemas** - Gestão de Gastos
- **Informática para Internet** - Feira Online
- **Administração** - Gestão Sustentável
- **Mecânica** - Motores Elétricos
- **Eletrotécnica** - Energia Solar
- **Logística** - Entrega Inteligente
- **Segurança do Trabalho** - Ambiente Seguro
- **Edificações** - Construção Sustentável
- **Design Gráfico** - Identidade Visual

## 🔧 Scripts Disponíveis

```bash
npm start          # Iniciar servidor em produção
npm run dev        # Desenvolvimento com nodemon
npm run db:init    # Inicializar banco completo
npm run db:migrate # Executar migrações
npm run db:seed    # Inserir dados iniciais
npm run db:rollback # Reverter migrações
npm run db:status  # Status das migrações
```

## 🚀 Deploy

### Deploy Local
O sistema está otimizado para deploy em:
- **Heroku** (Procfile incluído)
- **DigitalOcean**
- **AWS EC2**
- **Google Cloud Platform**

### Variáveis de Produção
```env
NODE_ENV=production
PORT=80
DB_HOST=seu-host-producao
DB_PORT=11550
DB_USER=usuario-producao
DB_PASSWORD=senha-segura
DB_NAME=banco-producao
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para a **Feira de Profissões do SENAC** e está disponível para uso educacional e institucional.

## 👨‍💻 Desenvolvedor

**Victor Capoeira**
- GitHub: [@VictorCapoeira](https://github.com/VictorCapoeira)

---

<div align="center">

### 🏆 Feito com ❤️ para o SENAC

*Sistema de Votação da Feira de Profissões - Conectando talento e inovação*

</div>