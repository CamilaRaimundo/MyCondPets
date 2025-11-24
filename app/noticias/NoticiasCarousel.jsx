"use client";

import { useRef } from "react";
import "./CSS/noticiasPage.css";

export default function NoticiasCarousel({ noticias }) {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -1200, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 1200, behavior: "smooth" });
  };

  return (
    <section className="carousel-section">
      <button className="carousel-button left" onClick={scrollLeft}>←</button>

      <div className="noticias-carousel" ref={carouselRef}>
        {noticias.map((noticia) => (
          
          <div key={noticia.id} className="carousel-card">
            <div className="carousel-image-container">
              <img src={noticia.imagem} alt={noticia.titulo} />
              <span className={`status-badge ${noticia.status.toLowerCase()}`}>
                {noticia.status}
              </span>
            </div>

            <div className="carousel-info">
              <p className="carousel-title">{noticia.titulo}</p>
              <p className="carousel-contato">Contato: {noticia.contato}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-button right" onClick={scrollRight}>→</button>
    </section>
  );
}