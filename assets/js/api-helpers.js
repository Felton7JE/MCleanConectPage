// API Helpers para MCLeanConnect
// Funções para comunicar com as APIs do backend

const API_BASE_URL = window.location.origin;

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
    return { success: false, message: 'Erro ao enviar email' };
  }
}

async function loadComments(page = 1, limit = 5) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao carregar comentários:', error);
    return { comments: [], total: 0, page: 1, totalPages: 1 };
  }
}

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
    return { success: false, message: 'Erro ao salvar comentário' };
  }
}

// Tornar as funções disponíveis globalmente
window.sendEmail = sendEmail;
window.loadComments = loadComments;
window.saveComment = saveComment;
