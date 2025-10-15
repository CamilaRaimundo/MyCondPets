import "./styles.css";

export default function Home() {
  return (
    <main className="container">
      {/* Conteúdo principal */}
      <section className="content">
        <div className="image-container">
          <img src="../images/pet11.jpg" className="pets-image" />
        </div>

        <div className="infos">
          <div className="label-info">
            <h1>Nome</h1>
            <input type="text" placeholder="Fulano da Silva" />
          </div>

          <div className="label-info">
            <h1>Apartamento</h1>
            <input type="text" placeholder="Apart. 20, Bloco C, Torre A" />
          </div>

          <div className="label-info">
            <h1>Contato</h1>
            <input type="text" placeholder="(99) 99999-9999" />
          </div>

          <div className="meus-pets">
            aa
          </div>
        </div>


      </section>

    </main>
  );
}
