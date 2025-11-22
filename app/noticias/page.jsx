import pool from "@/app/_lib/db";
import "./CSS/noticiasPage.css";
import NoticiasCarousel from "./NoticiasCarousel";

export default async function Noticias() {
  let noticias = [];

  try {
    const client = await pool.connect();

    try {
      // Busca todas as notícias com informações do dono
      const result = await client.query(`
        SELECT 
          n.not_id,
          n.not_titulo,
          n.not_conteudo,
          n.not_data_publicacao,
          n.don_id,
          d.don_nome,
          d.don_contato,
          p.pet_foto 
        FROM noticias n
        INNER JOIN dono d ON n.don_id = d.don_id
        LEFT JOIN pet p ON p.don_id = d.don_id
        ORDER BY n.not_data_publicacao DESC;
      `); 

      noticias = result.rows.map((row) => ({
        id: row.not_id,
        nome: row.not_titulo,
        status: row.not_titulo.toLowerCase().includes("perdido")
          ? "Perdido"
          : "Encontrado",
        contato: row.don_contato || "Sem contato",
        imagem: "/images/pet1.jpg",
        descricao: row.not_conteudo,
        dono: row.don_nome,
        dataCriacao: row.not_data_publicacao,
      }));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    // Dados de fallback caso haja erro
    noticias = [
      {
        id: 1,
        nome: "Totó",
        status: "Perdido",
        contato: "99 99999-9999",
        imagem: "/images/pet1.jpg",
      },
      {
        id: 2,
        nome: "Pet sem coleira",
        status: "Encontrado",
        contato: "99 99999-9999",
        imagem: "/images/pet2.jpg",
      },
    ];
  }

  return (
    <main className="container">
      {/* Título da página */}
      <section className="header-section">
        <div className="title-container">
          <span className="newspaper-icon"></span>
          <h1 className="page-title">Notícias</h1>
        </div>
      </section>

      {/* Carrossel de notícias */}
      <NoticiasCarousel noticias={noticias} />
    </main>
  );
}
