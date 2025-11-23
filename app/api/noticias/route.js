import { NextResponse } from 'next/server';
import pool from '../../_lib/db';

// ===========================
//     GET — LISTAR NOTÍCIAS
// ===========================
export async function GET() {
  let client;

  try {
    client = await pool.connect();

    const result = await client.query(`
      SELECT *
      FROM noticias
      ORDER BY not_data_publicacao DESC
    `);

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar notícias', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}


// ===========================
//    POST — CRIAR NOTÍCIA
// ===========================
export async function POST(request) {
  let client;

  try {
    const body = await request.json();

    const { titulo, descricao, donId, foto } = body;

    // validações
    if (!titulo?.trim()) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      );
    }

    if (!descricao?.trim()) {
      return NextResponse.json(
        { error: 'Descrição é obrigatória' },
        { status: 400 }
      );
    }

    if (!donId) {
      return NextResponse.json(
        { error: 'Dono é obrigatório' },
        { status: 400 }
      );
    }

    if (!foto) {
      return NextResponse.json(
        { error: 'Foto é obrigatória' },
        { status: 400 }
      );
    }

    client = await pool.connect();

    // verifica se o dono existe
    const donoCheck = await client.query(
      'SELECT don_id FROM dono WHERE don_id = $1',
      [donId]
    );

    if (donoCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Dono não encontrado' },
        { status: 404 }
      );
    }

    // insere notícia
    const result = await client.query(
      `INSERT INTO noticias (
        not_titulo,
        not_conteudo,
        not_data_publicacao,
        don_id,
        not_foto
      ) VALUES ($1, $2, NOW(), $3, $4)
      RETURNING *`,
      [
        titulo.trim(),
        descricao.trim(),
        donId,
        foto
      ]
    );

    return NextResponse.json(
      {
        message: 'Notícia publicada com sucesso!',
        noticia: result.rows[0]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    return NextResponse.json(
      { error: 'Erro ao criar notícia', details: error.message },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}