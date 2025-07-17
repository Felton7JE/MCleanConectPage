// API Helpers para comunicação com backend
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:3002' 
  : '';

// Função para enviar emails
async function sendEmail(type, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}

// Função para carregar comentários
async function loadComments(page = 1, limit = 5) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments?page=${page}&limit=${limit}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao carregar comentários:', error);
    throw error;
  }
}

// Função para salvar comentário
async function saveComment(name, text) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, text })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao salvar comentário:', error);
    throw error;
  }
}
