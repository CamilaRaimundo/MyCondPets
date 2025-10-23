import pool from '../../lib/db';

export default async function handler(req, res) {
  // Permite apenas o método GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let client; // Declara a variável do cliente fora do try para que seja acessível no finally

  try {
    // 1. Pega uma conexão ("cliente") do pool
    client = await pool.connect();
    
    // 2. Executa a sua query SQL
    const result = await client.query('SELECT id, name, email FROM users;');
    
    // 3. Retorna os resultados como JSON
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  } finally {
    // 4. ESSENCIAL: Libera o cliente de volta para o pool
    if (client) {
      client.release();
    }
  }
}