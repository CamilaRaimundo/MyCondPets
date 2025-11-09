"use client";

import "./CSS/noticiasPage.css";
import { useState } from "react";

export default function Noticias() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const noticias = [
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
    {
      id: 3,
      nome: "Jujuba",
      status: "Encontrado",
      contato: "99 99999-9999",
      imagem: "/images/pet3.jpg",
    },
    {
      id: 4,
      nome: "Rex",
      status: "Perdido",
      contato: "99 99999-9999",
      imagem: "/images/pet4.jpg",
    },
    {
      id: 5,
      nome: "Mimi",
      status: "Perdido",
      contato: "99 99999-9999",
      imagem: "/images/pet5.jpg",
    },
    {
      id: 6,
      nome: "Bob",
      status: "Encontrado",
      contato: "99 99999-9999",
      imagem: "/images/pet6.jpg",
    },
    {
      id: 7,
      nome: "Luna",
      status: "Perdido",
      contato: "99 99999-9999",
      imagem: "/images/pet1.jpg",
    },
    {
      id: 8,
      nome: "Thor",
      status: "Encontrado",
      contato: "99 99999-9999",
      imagem: "/images/pet2.jpg",
    },
    {
      id: 9,
      nome: "Mel",
      status: "Perdido",
      contato: "99 99999-9999",
      imagem: "/images/pet3.jpg",
    },
    {
      id: 10,
      nome: "Bolinha",
      status: "Encontrado",
      contato: "99 99999-9999",
      imagem: "/images/pet4.jpg",
    },
    {
      id: 11,
      nome: "Pingo",
      status: "Perdido",
      contato: "99 99999-9999",
      imagem: "/images/pet5.jpg",
    },
    {
      id: 12,
      nome: "Princesa",
      status: "Encontrado",
      contato: "99 99999-9999",
      imagem: "/images/pet6.jpg",
    },
    {
      id: 13,
      nome: "Max",
      status: "Perdido",
      contato: "99 99999-9999",
      imagem: "/images/pet1.jpg",
    },
    {
      id: 14,
      nome: "Nina",
      status: "Encontrado",
      contato: "99 99999-9999",
      imagem: "/images/pet2.jpg",
    },
    {
      id: 15,
      nome: "Bisteca",
      status: "Perdido",
      contato: "99 99999-9999",
      imagem: "/images/pet3.jpg",
    },
  ];

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
    <main className="container">
      {/* Título da página */}
      <section className="header-section">
        <div className="title-container">
          <span className="newspaper-icon">📰</span>
          <h1 className="page-title">Notícias</h1>
        </div>
      </section>

      {/* Carrossel de notícias */}
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
    </main>
  );
}
