import "./styles.css";
import pool from "@/app/_lib/db"

export default async function Home() {
  const client = await pool.connect();
  const result = await client.query('SELECT don_cpf, don_nome, don_email, don_senha, don_contato FROM dono;');
  const donos = result.rows;
  client.release();


  // if (!session && status === "unauthenticated") {
  //   return (
  //     <div className="naoLogado">
  //       <p>Você precisa estar logado para acessar esta página.</p>
  //     </div>
  //   )
  // }

  return (
    <main className="container">
      {/* Conteúdo principal */}
      <section className="content">
        <div className="image-container">
          <img src="../images/pet11.jpg" className="pets-image" />
        </div>

        {
          donos.map((dono) => (
          
            <div className="infos" key={dono.don_cpf}>
              <div className="label-info">
                <h1>Nome</h1>
                <input type="text" value={dono.don_nome} disabled />
              </div>

              <div className="label-info">
                <h1>E-mail</h1>
                <input type="text" value={dono.don_email} disabled />
              </div>

              <div className="label-info">
                <h1>Apartamento</h1>
                <input type="text" placeholder="Apart. 20, Bloco C, Torre A" />
              </div>

              <div className="label-info">
                <h1>Contato</h1>
                <input type="text" value={dono.don_contato} disabled />
              </div>

              <div className="meus-pets">
                aa
              </div>
            </div>
          ))
        }
      </section>

    </main>
  );
}
