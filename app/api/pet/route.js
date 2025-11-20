import pool from "@/app/_lib/db";

export async function DELETE(request) {
  console.log("Entrou ", request)
  const { pet_nome, userEmail } = await request.json();

  if (!pet_nome || !don_cpf) {
    return new Response(JSON.stringify({ error: "Dados inválidos" }), { status: 400 });
  }

  const client = await pool.connect();

  try {

    //     const donoResult = await client.query(
    //   'SELECT don_id, don_nome, don_email, don_contato FROM dono WHERE don_email = $1;',
    //   [userEmail]
    // );
    dono = donoResult.rows[0];
    await client.query("DELETE FROM pet WHERE pet_nome = $1 AND don_email = $2;", [
      [pet_nome, userEmail]
    ]);

    return new Response(JSON.stringify({ message: "Pet excluído com sucesso" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao excluir pet:", error);
    return new Response(JSON.stringify({ error: "Erro ao excluir pet" }), { status: 500 });
  } finally {
    client.release();
  }
}
