"use client";
import { useState } from "react";
import "./CSS/noticiasCarousel.css";

export default function NoticiasCarousel({ noticias = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!noticias || noticias.length === 0) {
    return <p className="mensagem-vazia">Nenhuma notícia encontrada.</p>;
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === noticias.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? noticias.length - 1 : prevIndex - 1
    );
  };

  const noticiaAtual = noticias[currentIndex];

  const formatarData = (data) => {
    if (!data) return "";
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="carousel-container">
      <button className="btn-nav esquerda" onClick={prevSlide}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      <div className="noticia-card">
        <img
          src={noticiaAtual.imagem || "/images/padrao.jpg"}
          alt={noticiaAtual.nome}
          className="noticia-imagem"
        />

        <div className="noticia-conteudo">
          <h2 className="noticia-titulo">{noticiaAtual.nome}</h2>
          <p className={`noticia-status ${noticiaAtual.status.toLowerCase()}`}>
            {noticiaAtual.status}
          </p>
          <p className="noticia-descricao">{noticiaAtual.descricao}</p>

          <div className="noticia-detalhes">
            <p>
              <strong>Dono:</strong> {noticiaAtual.dono}
            </p>
            <p>
              <strong>Contato:</strong> {noticiaAtual.contato}
            </p>
            <p>
              <strong>Data:</strong> {formatarData(noticiaAtual.dataCriacao)}
            </p>
          </div>
        </div>
      </div>

      <button className="btn-nav direita" onClick={nextSlide}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
}
