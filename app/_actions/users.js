import pool from '../../_lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let client;

  try {
    client = await pool.connect();

    const result = await client.query('SELECT don_cpf, don_nome, don_email, don_senha, don_contato FROM dono;');

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  } finally {
    if (client) {
      client.release();
    }
  }
}