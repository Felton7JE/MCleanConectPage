import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type, data } = req.body;

  // Configurar o transportador de email
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // mcleanconnect@gmail.com
      pass: process.env.EMAIL_PASS, // senha de app do Gmail
    },
  });

  try {
    let emailContent = '';
    let subject = '';

    if (type === 'account-deletion') {
      subject = 'Solicitação de Exclusão de Conta - MCLeanConnect';
      emailContent = `
SOLICITAÇÃO DE EXCLUSÃO DE CONTA - MCLEANCONNECT
Desenvolvido por: nobody_dev

=== DADOS DO SOLICITANTE ===
Nome Completo: ${data.fullName}
E-mail da Conta: ${data.accountEmail}
Telefone: ${data.phone || 'Não informado'}
Tipo de Conta: ${data.accountType}

=== DETALHES DA SOLICITAÇÃO ===
Motivo da Exclusão: ${data.deletionReason || 'Não especificado'}
Comentários: ${data.comments || 'Nenhum comentário adicional'}
Data da Solicitação: ${data.requestDate}

=== CONFIRMAÇÃO ===
Usuário confirma que entende que esta ação é irreversível: ${data.confirmDeletion ? 'SIM' : 'NÃO'}

Por favor, processem esta solicitação de exclusão de conta conforme a política de privacidade do MCLeanConnect.

---
Esta solicitação foi gerada automaticamente através do site oficial.
      `;
    } else if (type === 'support-request') {
      subject = 'Solicitação de Apoio - MCLeanConnect';
      emailContent = `
SOLICITAÇÃO DE APOIO - MCLEANCONNECT

=== DADOS DO SOLICITANTE ===
Nome: ${data.nome}
Contato: ${data.contato}
Localização: ${data.localizacao}
Serviço: ${data.servico}

=== DETALHES ===
Sobre você e experiência: ${data.descricao}
Tipo de ajuda necessária: ${data.ajuda}

Data da solicitação: ${new Date().toLocaleString('pt-BR')}

---
Solicitação enviada através do formulário de apoio.
      `;
    } else if (type === 'contact') {
      subject = `Contato - ${data.tipo} - MCLeanConnect`;
      emailContent = `
NOVO CONTATO - MCLEANCONNECT

=== DADOS ===
Tipo: ${data.tipo}
E-mail: ${data.email}
Mensagem: ${data.mensagem}

Data: ${new Date().toLocaleString('pt-BR')}

---
Mensagem enviada através do formulário de contato.
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'mcleanconnect@gmail.com',
      subject: subject,
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, message: 'Erro ao enviar email' });
  }
}
