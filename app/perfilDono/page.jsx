import "./styles.css";
import pool from "@/app/_lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

function formatarTelefone(telefone) {
  if (!telefone) return "";
  const apenasNumeros = telefone.replace(/\D/g, "");
  if (apenasNumeros.length === 11)
    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  else if (apenasNumeros.length === 10)
    return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  else return telefone;
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userEmail = session.user.email;

  const client = await pool.connect();

  // declarar variáveis fora do try para uso no return
  let dono = null;
  let pets = [];
  let residencia = null;

  try {
    // busca o dono logado
    const donoResult = await client.query(
      'SELECT don_cpf, don_nome, don_email, don_contato FROM dono WHERE don_email = $1;',
      [userEmail]
    );
    dono = donoResult.rows[0];

    if (dono) {
      // busca os pets do dono
      const petsResult = await client.query(
        'SELECT pet_nome, pet_tipo FROM pet WHERE don_cpf = $1;',
        [dono.don_cpf]
      );
      pets = petsResult.rows;

      // busca a residência do dono
      const residenciaResult = await client.query(
        'SELECT res_complemento FROM residencia WHERE don_cpf = $1;',
        [dono.don_cpf]
      );
      residencia = residenciaResult.rows[0]
    }
  } finally {
    client.release();
  }

  if (!dono) return <p>Dono não encontrado</p>;

  return (
    <main className="content">
      <script src="https://kit.fontawesome.com/58c0554857.js" crossOrigin="anonymous"></script>

      <div className="image-container">
        <img src="../images/pet11.jpg" className="pets-image" />
      </div>

      <section className="contentInfos">
        <h1 className="title"><i className="fa-solid fa-user"></i> Meu Perfil</h1>
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
            <input type="text" value={residencia.res_complemento} disabled/>
          </div>
          <div className="label-info">
            <h1>Contato</h1>
            <input type="text" value={formatarTelefone(dono?.don_contato)} disabled />
          </div>
        </div>

        <section className="meus-pets">
          <div className="titulo-pets">
            <h2>Meus Pets</h2>
          </div>
          <div className="lista-pets">
            {pets.map((pet, index) => (
              <div className="pet-item" key={index}>
                <div className="pet-info">
                  <span className="icone"><i className="fa-solid fa-paw"></i></span>
                  <span className="nome">{pet.pet_nome}</span>
                </div>
                <div className="acoes">
                  <button className="btn-delete"><i className="fa-solid fa-square-minus"></i></button>
                  <button className="btn-edit"><i className="fa-solid fa-pen-to-square"></i></button>
                </div>
              </div>
            ))}
          </div>
          <div className="add-pet">
            <button className="btn-add"><i className="fa-solid fa-circle-plus"></i></button>
          </div>
        </section>
      </section>
    </main>
  );
}
