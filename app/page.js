import "./styles.css";

export default function Home() {
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

        <div className="image-container">
          <img src="../images/pet1.jpg" alt="Cachorro feliz" className="dog-image" />
        </div>
      </section>

    </main>
  );
}
