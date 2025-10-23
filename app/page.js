import "./styles.css";
import pool from "@/app/_lib/db"

export default async function Home() {
  
  let donos = [];

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT don_cpf, don_nome, don_email, don_senha, don_contato FROM dono;');
    donos = result.rows;
    
    client.release();


  } catch (error) {
    console.error("Erro ao buscar donos:", error);
  }

  return (
    <main className="container">
      {/* Conteúdo principal */}
      <section className="content">
        <div className="text">
          <h1>MyCondPets</h1>
          <p>
            Organização, segurança e carinho em cada{" "}
            <span className="highlight">patinha!</span>
          </p>
        </div>

        {
          donos.map((dono) => (
            <div key={dono.don_cpf} className="dono-info">
              <h2>Nome: {dono.don_nome}</h2>
              <p>Email: {dono.don_email}</p>
              <p>Senha: {dono.don_senha}</p>
              <p>Contato: {dono.don_contato}</p>
            </div>
          ))
        }

        <div className="image-container">
          <img src="../images/pet1.jpg" alt="Cachorro feliz" className="dog-image" />
        </div>
      </section>

    </main>
  );
}
