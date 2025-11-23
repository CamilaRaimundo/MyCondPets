import pool from "@/app/_lib/db";
import "./CSS/noticiasPage.css";
import NoticiasCarousel from "./noticiasCarousel";
import Link from "next/link";

export default async function Noticias() {
  let noticias = [];

  try {
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT 
          n.not_id,
          n.not_titulo,
          n.not_conteudo,
          n.not_data_publicacao,
          n.not_foto,
          d.don_nome,
          d.don_contato
        FROM noticias n
        INNER JOIN dono d 
          ON n.don_id = d.don_id
        ORDER BY n.not_data_publicacao DESC;
      `);

      noticias = result.rows.map((row) => ({
        id: row.not_id,
        titulo: row.not_titulo,
        descricao: row.not_conteudo,
        data: row.not_data_publicacao,
        dono: row.don_nome,
        contato: row.don_contato || "Sem contato",
        imagem: row.not_foto,
        status: row.not_titulo.toLowerCase().includes("perdido")
          ? "Perdido"
          : "Encontrado",
      }));

    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
  }

  return (
    <main className="container">
      <div className="title-container">
        <h1 className="page-title">Notícias</h1>

        {/* 🔹 Botão para adicionar notícia */}
        <Link href="/criarNoticias" className="add-noticia-btn">
          + Adicionar Notícia
        </Link>
      </div>

      <NoticiasCarousel noticias={noticias} />
    </main>
  );
}
