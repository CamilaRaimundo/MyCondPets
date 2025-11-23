"use client";
import { useEffect, useState } from "react";
import "./styles.css";

export default function DetalhesPets() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);

  // Buscar pets do banco
  useEffect(() => {
    async function loadPets() {
      try {
        const res = await fetch("/api/detalhesPets");
        const data = await res.json();
        setPets(data);
        setSelectedPet(data[0]); // seleciona primeiro pet
      } catch (err) {
        console.error("Erro ao carregar pets", err);
      }
    }
    loadPets();
  }, []);

  if (!selectedPet) {
    return <div className="loading">Carregando Pets...</div>;
  }

  const filteredPets = pets.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (pet) => {
    setSelectedPet(pet);
    setSearch("");
  };

  return (
    <main className="container">
      {/* Lado esquerdo */}
      <div className="profile">

        {/* <img
          src={selectedPet.foto || "/default-pet.png"}
          alt={selectedPet.nome}
        /> */}

        <h2>{selectedPet.nome}</h2>

        <div className="info-box">
          <h3>Informações do Pet</h3>
          <div className="info-item">🐾 Raça: {selectedPet.raca}</div>
          <div className="info-item">🎂 Idade: {selectedPet.idade}</div>
          <div className="info-item">🎨 Cor: {selectedPet.cor}</div>
        </div>

        <div className="info-box">
          <h3>Informações do Dono</h3>
          <div className="info-item">👤 {selectedPet.dono}</div>
          <div className="info-item">🏢 {selectedPet.endereco}, {selectedPet.num}</div>
          <div className="info-item">📞 {selectedPet.telefone}</div>
        </div>
      </div>

      {/* Lado direito */}
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
  );
}
