import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

async function connectToDatabase() {
  const client = await clientPromise;
  return client.db('mcleanconnect');
}

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await connectToDatabase();
    const commentsCollection = db.collection('comments');

    if (req.method === 'GET') {
      // Buscar comentários com paginação
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      const comments = await commentsCollection
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await commentsCollection.countDocuments();

      res.status(200).json({
        comments,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });

    } else if (req.method === 'POST') {
      // Adicionar novo comentário
      const { name, text } = req.body;

      if (!name || !text) {
        return res.status(400).json({ message: 'Nome e comentário são obrigatórios' });
      }

      const newComment = {
        name: name.trim(),
        text: text.trim(),
        createdAt: new Date(),
        date: new Date().toLocaleString('pt-BR')
      };

      const result = await commentsCollection.insertOne(newComment);

      res.status(201).json({
        success: true,
        comment: { ...newComment, _id: result.insertedId }
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Erro na API de comentários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
