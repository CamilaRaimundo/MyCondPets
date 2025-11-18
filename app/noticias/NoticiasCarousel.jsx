"use client";

export default function NoticiasCarousel({ noticias }) {
  const handleScrollLeft = () => {
    const container = document.querySelector(".noticias-carousel");
    if (container) {
      container.scrollBy({ left: -1200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    const container = document.querySelector(".noticias-carousel");
    if (container) {
      container.scrollBy({ left: 1200, behavior: "smooth" });
    }
  };

  return (
    <section className="carousel-section">
      <button
        className="carousel-button left"
        onClick={handleScrollLeft}
        aria-label="Rolar para esquerda"
      >
        ←
      </button>

      <div className="noticias-carousel">
        {noticias.map((noticia) => (
          <div key={noticia.id} className="noticia-card">
            <div className="card-image-container">
              <img
                src={noticia.imagem}
                alt={noticia.nome}
                className="card-image"
              />
              <span
                className={`status-badge ${
                  noticia.status === "Perdido" ? "perdido" : "encontrado"
                }`}
              >
                {noticia.status}
              </span>
            </div>
            <div className="card-info">
              <div className="info-row">
                <span className="paw-icon">🐾</span>
                <p className="pet-name">Nome: {noticia.nome}</p>
              </div>
              <div className="info-row">
                <span className="phone-icon">📞</span>
                <p className="pet-contact">Contato: {noticia.contato}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-button right"
        onClick={handleScrollRight}
        aria-label="Rolar para direita"
      >
        →
      </button>
    </section>
  );
}
