import pool from "@/app/_lib/db";

export async function GET() {
  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT 
        pet_nome AS nome,
        pet_raca AS raca,
        pet_idade AS idade,
        pet_cor AS cor,
        pet_sexo AS sexo,
        pet_porte AS porte,
        don_nome AS dono
      FROM pet
      INNER JOIN dono ON pet.don_id = dono.don_id;
    `);

    client.release();

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("🔥 ERRO REAL:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
