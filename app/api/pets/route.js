import { NextResponse } from 'next/server';
import pool from '../../_lib/db';

// ============================== 
// GET - Buscar todos os pets
// ============================== 
export async function GET() {
  console.log('🔍 Buscando lista de pets...');
  let client;

  try {
    client = await pool.connect();
    console.log('✅ Conectado ao banco!');

    // Busca todos os pets com informações do dono
    const result = await client.query(`
      SELECT 
        p.pet_id,
        p.pet_nome,
        p.pet_especie,
        p.pet_raca,
        p.pet_porte,
        p.pet_cor,
        p.don_id,
        d.don_nome AS dono_nome,
        d.don_sobrenome AS dono_sobrenome
      FROM pet p
      LEFT JOIN dono d ON p.don_id = d.don_id
      ORDER BY p.pet_nome ASC
    `);

    console.log(`✅ ${result.rows.length} pets encontrados`);

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error('❌ Erro ao buscar pets:', error);
    console.error('Stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar pets', 
        details: error.message 
      }, 
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}