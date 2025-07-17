import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    // Configurar transportador de email
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'mcleanconnect@gmail.com'
    };

    // Configurar email baseado no tipo
    switch (type) {
      case 'account-deletion':
        mailOptions.subject = 'Solicitação de Exclusão de Conta - MCleanConnect';
        mailOptions.html = `
          <h2>Solicitação de Exclusão de Conta</h2>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Motivo:</strong> ${data.motivo}</p>
          <p><strong>Data da solicitação:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        `;
        break;

      case 'support-request':
        mailOptions.subject = 'Solicitação de Apoio para Prestador - MCleanConnect';
        mailOptions.html = `
          <h2>Solicitação de Apoio para Prestador</h2>
          <p><strong>Nome:</strong> ${data.nome}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Telefone:</strong> ${data.telefone}</p>
          <p><strong>Área de Atuação:</strong> ${data.area}</p>
          <p><strong>Localização:</strong> ${data.localizacao}</p>
          <p><strong>Descrição:</strong> ${data.descricao}</p>
          <p><strong>Data da solicitação:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        `;
        break;

      case 'contact':
        mailOptions.subject = `Contato do Site - ${data.tipo}`;
        mailOptions.html = `
          <h2>Nova Mensagem do Site</h2>
          <p><strong>Tipo de Contato:</strong> ${data.tipo}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Mensagem:</strong> ${data.mensagem}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        `;
        break;

      default:
        return res.status(400).json({ success: false, message: 'Tipo de email inválido' });
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email enviado com sucesso' });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}
