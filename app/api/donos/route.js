import { NextResponse } from 'next/server';
import pool from '../../_lib/db';

export async function GET() {
  let client;

  try {
    client = await pool.connect();

    const result = await client.query(`
      SELECT 
        don_id,
        don_nome,
        don_email
      FROM dono
      ORDER BY don_nome ASC
    `);

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error(' Erro ao buscar donos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar donos', details: error.message }, 
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}