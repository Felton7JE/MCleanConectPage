import { MongoClient } from 'mongodb';

let client;
let db;

async function connectToDatabase() {
  if (client && client.topology && client.topology.isConnected()) {
    return client.db('mcleanconnect');
  }
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('mcleanconnect');
  return db;
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const database = await connectToDatabase();
    const collection = database.collection('comments');

    if (req.method === 'GET') {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      const comments = await collection
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await collection.countDocuments();
      const totalPages = Math.ceil(total / limit);

      const formattedComments = comments.map(comment => ({
        name: comment.name,
        text: comment.text,
        date: comment.createdAt.toLocaleString('pt-BR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      res.status(200).json({
        success: true,
        comments: formattedComments,
        page,
        totalPages,
        total
      });

    } else if (req.method === 'POST') {
      const { name, text } = req.body;

      if (!name || !text) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nome e comentário são obrigatórios' 
        });
      }

      const comment = {
        name: name.trim(),
        text: text.trim(),
        createdAt: new Date()
      };

      await collection.insertOne(comment);
      res.status(201).json({ success: true, message: 'Comentário salvo com sucesso' });

    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Erro na API de comentários:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}
