"use client";

import { useState } from "react";
import { pets } from "./pets";


export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState(pets[0]); // começa com Totó

  const filteredPets = pets.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (pet: any) => {
    setSelectedPet(pet);
    setSearch(""); // limpa o campo após escolher
  };

  return (
    <>
      {/* Cabeçalho */}
      <header className="header">
        <img src="logo_fundo-removebg.png" alt="Logo" />
        <h1>MyCondPets</h1>
      </header>

      <main className="container">
        {/* Lado esquerdo */}
        <div className="profile">
          <img src={selectedPet.imagem} alt={selectedPet.nome} />
          <h2>{selectedPet.nome}</h2>

          <div className="info-box">
            <h3>Informações do Pet</h3>
            <div className="info-item">
              🐾 <span>Raça: {selectedPet.raca}</span>
            </div>
            <div className="info-item">
              🎂 <span>Idade: {selectedPet.idade}</span>
            </div>
            <div className="info-item">
              🎨 <span>Cor: {selectedPet.cor}</span>
            </div>
          </div>

          <div className="info-box">
            <h3>Informações do dono</h3>
            <div className="info-item">👤 {selectedPet.dono}</div>
            <div className="info-item">🏢 {selectedPet.endereco}</div>
            <div className="info-item">📞 {selectedPet.telefone}</div>
          </div>
        </div>

        {/* Lado direito - pesquisa */}
        <div className="search-section">
          <h3>Pesquisa</h3>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar pet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="search-results">
            {filteredPets.map((p) => (
              <div key={p.nome} onClick={() => handleSelect(p)}>
                {p.nome}, {p.endereco}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="footer">Copyright - 2025</footer>
    </>
  );
}
