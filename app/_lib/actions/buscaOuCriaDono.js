"use server";

import pool from "../db";

/**
 * Busca um 'dono' pelo email. Se não encontrar, cria um novo.
 * Retorna o usuário e um booleano 'isNew'
 */
export async function buscaOuCriaDono(email, name) {
  if (!email) {
    throw new Error("Email é obrigatório.");
  }

  try {
    let result = await pool.query("SELECT * FROM dono WHERE don_email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      return { dono: result.rows[0], isNew: false };
    }

    result = await pool.query(
      "INSERT INTO dono (don_email, don_nome) VALUES ($1, $2) RETURNING *",
      [email, name]
    );

    return { dono: result.rows[0], isNew: true };
  } catch (error) {
    console.error("Erro no banco de dados ao buscar/criar dono:", error);
    throw new Error("Não foi possível processar o login.");
  }
}
