# MCLeanConnect - Website com Sistema de Comentários e Emails

## 🚀 Deploy no Vercel

Este projeto está configurado para funcionar perfeitamente no Vercel com MongoDB e envio de emails.

### Configuração Necessária

#### 1. Variáveis de Ambiente no Vercel

Configure estas variáveis no painel do Vercel (`Settings > Environment Variables`):

```
EMAIL_USER=mcleanconnect@gmail.com
EMAIL_PASS=[sua_senha_de_app_do_gmail]
MONGODB_URI=mongodb+srv://[usuario]:[senha]@[cluster].mongodb.net/mcleanconnect
```

#### 2. Configurar Gmail para Envio de Emails

1. Acesse [Google Account App Passwords](https://myaccount.google.com/apppasswords)
2. Gere uma senha de app específica para este projeto
3. Use essa senha na variável `EMAIL_PASS`

#### 3. Configurar MongoDB Atlas (Gratuito)

1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um cluster gratuito
3. Crie um usuário de banco de dados
4. Configure o IP allowlist (0.0.0.0/0 para permitir de qualquer lugar)
5. Copie a connection string para `MONGODB_URI`

### Funcionalidades Implementadas

#### ✅ Sistema de Emails
- **Exclusão de Conta**: Formulário automático que envia detalhes para `mcleanconnect@gmail.com`
- **Apoio ao Prestador**: Formulário de solicitação de apoio
- **Contato Geral**: Sistema para outros tipos de contato

#### ✅ Sistema de Comentários com MongoDB
- **Armazenamento**: Comentários salvos no MongoDB Atlas
- **Paginação**: Sistema de páginas para melhor performance
- **Tempo Real**: Comentários aparecem imediatamente após serem adicionados

### Estrutura das APIs

```
/api/
├── send-email.js    # Envio de emails via Nodemailer
└── comments.js      # CRUD de comentários com MongoDB
```

### Dependências

- `nodemailer`: Envio de emails
- `mongodb`: Driver oficial do MongoDB

### Como Testar Localmente

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

3. Execute localmente:
```bash
vercel dev
```

### Deploy Automático

Cada push para a branch `main` fará deploy automático no Vercel.

---

**Desenvolvido por nobody_dev para MCLeanConnect**
