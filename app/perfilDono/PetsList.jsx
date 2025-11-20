"use client";
import { useState } from "react";

export function PetsList({ pets, donoCpf }) {
  const [listaPets, setListaPets] = useState(pets || []);

  async function excluirPet(petNome) {
    if (!confirm(`Tem certeza que deseja excluir ${petNome}?`)) return;

    try {
      // const res = await fetch("/api/pet", {
      //   method: "DELETE",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ pet_nome: petNome, don_cpf: donoCpf }),
      // });

      const res = excluiPET();
      
      if (!res.ok) throw new Error("Erro ao excluir pet");

      setListaPets((prev) => prev.filter((p) => p.pet_nome !== petNome));
      alert("Pet excluído com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir o pet.");
    }
  }

  if (listaPets.length === 0) {
    return <p>Nenhum pet cadastrado.</p>;
  }

  return (
    <div className="lista-pets">
      {listaPets.map((pet, index) => (
        <div className="pet-item" key={index}>
          <div className="pet-info">
            <span className="icone"><i className="fa-solid fa-paw"></i></span>
            <span className="nome">{pet.pet_nome}</span>
          </div>
          <div className="acoes">
            <button className="btn-delete" onClick={() => excluirPet(pet.pet_nome)}>
              <i className="fa-solid fa-square-minus"></i>
            </button>
            <button className="btn-edit">
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}