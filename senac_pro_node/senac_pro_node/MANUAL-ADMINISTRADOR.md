# Manual do Administrador - Sistema de Votação

## 🔐 Acesso Administrativo

**CPF do Administrador:** `12345678912`

Este CPF tem acesso especial ao sistema, podendo:
- ✅ Votar normalmente como qualquer usuário
- ✅ Acessar o placar de votação
- ✅ Ver estatísticas completas dos votos

---

## 🚀 Como Usar o Sistema

### 1. **Acessando o Sistema**
1. Abra o navegador e acesse: `http://localhost:3000`
2. Informe o CPF administrativo: `123.456.789-12`
3. O sistema detectará automaticamente que você é admin
4. Um link especial **"Placar [ADMIN]"** aparecerá no menu

### 2. **Votando (Opcional)**
- Como admin, você pode votar normalmente
- Escolha um projeto e vote
- Mesmo após votar, continuará tendo acesso ao placar

### 3. **Acessando o Placar**
1. Clique no link **"Placar [ADMIN]"** no menu superior
2. Na tela de autenticação, informe novamente: `123.456.789-12`
3. Clique em **"Acessar Placar"**
4. O placar completo será exibido com:
   - 🏆 Pódio dos 3 primeiros colocados
   - 📊 Tabela completa com todos os projetos
   - 📈 Percentuais e estatísticas detalhadas

---

## 🛡️ Segurança Implementada

### ✅ **Controles de Acesso**
- Apenas o CPF `12345678912` pode acessar o placar
- Usuários comuns **não veem** links para o placar
- Acesso direto à URL `/placar.html` é protegido
- API `/api/placar` requer autenticação

### 📝 **Logs de Auditoria**
O servidor registra no console:
- Acessos autorizados ao placar
- Tentativas não autorizadas de acesso
- Verificações de CPF administrativo

---

## 🔧 Resolução de Problemas

### **"Acesso negado" no placar**
- ✅ Verifique se digitou corretamente: `12345678912`
- ✅ Certifique-se de que o servidor está rodando
- ✅ Recarregue a página e tente novamente

### **Link do placar não aparece**
- ✅ Verifique se informou o CPF correto na página inicial
- ✅ Recarregue a página principal
- ✅ Tente fazer logout e login novamente

### **Erro "Falha ao carregar placar"**
- ✅ Verifique se o banco de dados está conectado
- ✅ Consulte os logs no console do servidor
- ✅ Reinicie o servidor se necessário

---

## 📊 Recursos do Placar

### **Pódio Visual**
- 🥇 **1º Lugar:** Destaque especial com ícone de troféu
- 🥈 **2º Lugar:** Posição de honra
- 🥉 **3º Lugar:** Terceiro colocado

### **Tabela Detalhada**
- 📋 Lista completa de todos os projetos
- 🔢 Número de votos recebidos
- 📊 Percentual em relação ao total
- 👨‍🏫 Nome do professor responsável
- 📈 Barra de progresso visual

### **Estatísticas**
- 🗳️ Total geral de votos
- 📊 Distribuição percentual
- 🏆 Classificação em tempo real

---

## ⚙️ Configurações Avançadas

### **Para Alterar o CPF Administrativo:**
1. Abra o arquivo `server.js`
2. Localize a linha: `const ADMIN_CPF = '12345678912';`
3. Substitua pelo novo CPF (apenas números)
4. Reinicie o servidor

### **Para Adicionar Mais Administradores:**
1. Modifique a constante `ADMIN_CPF` para um array
2. Atualize a lógica de verificação
3. Teste com os novos CPFs

---

## 🎯 Dicas de Uso

### **Monitoramento em Tempo Real**
- O placar atualiza automaticamente quando acessado
- Para ver atualizações, recarregue a página do placar
- Os votos aparecem imediatamente após serem registrados

### **Melhor Experiência**
- Use tela grande para melhor visualização do placar
- O sistema é responsivo (funciona em mobile)
- Mantenha o console do servidor aberto para logs

### **Demonstração para Outros**
- Mostre apenas a página principal para usuários comuns
- Eles não verão o link do placar
- Use seu CPF admin para demonstrar o sistema completo

---

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs no console do servidor
2. Consulte o arquivo `CONTROLE-ACESSO-PLACAR.md` para detalhes técnicos
3. Execute o script `test-controle-acesso.js` para diagnósticos

**Sistema implementado e funcionando! 🎉**