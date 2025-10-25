"use client";

import { useState } from "react";
import { FaPaw, FaBone, FaCalendar, FaVenusMars, FaArrowsUpDownLeftRight, FaCamera, FaCheck, FaXmark } from "react-icons/fa6";
import "./css/cadastroPet.css";

export default function CadastroPage() {
  const [preview, setPreview] = useState(null);
  const [especie, setEspecie] = useState("");
  const [racas, setRacas] = useState([]);

  const racasPorEspecie = {
    Cachorro: [
      "Labrador Retriever",
      "Golden Retriever",
      "Bulldog Francês",
      "Poodle",
      "Beagle",
      "Rottweiler",
      "Shih Tzu",
      "Yorkshire Terrier",
      "Border Collie",
      "Outros"
    ],
    Gato: [
      "Persa",
      "Siamês",
      "Maine Coon",
      "Sphynx",
      "Angorá",
      "British Shorthair",
      "Ragdoll",
      "Bengal",
      "Himalaio",
      "Outros"
    ]
  };

  const handleEspecieChange = (e) => {
    const especieSelecionada = e.target.value;
    setEspecie(especieSelecionada);
    setRacas(racasPorEspecie[especieSelecionada] || []);
  };

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div>
      {/* Conteúdo Principal */}
      <main className="container">
        <section className="dados-dono">
          <h2>Informações do Dono</h2>
          <p><strong>Nome:</strong> Felipe Tagliabues</p>
          <p><strong>Telefone:</strong> (51) 99999-9999</p>
          <p><strong>Bloco:</strong> A</p>
          <p><strong>Apartamento:</strong> 203</p>
        </section>

        <section className="cadastro-pet">
          <h2>Cadastro do Pet</h2>

          <form>
            <div className="form-grid">
              <div className="campo">
                <label htmlFor="nome-pet"><FaPaw /> Nome do Pet</label>
                <input type="text" id="nome-pet" name="nome-pet" placeholder="Ex: Rex" required />
              </div>

              <div className="campo">
                <label htmlFor="especie"><FaPaw /> Espécie</label>
                <select id="especie" name="especie" required onChange={handleEspecieChange}>
                  <option value="">Selecione...</option>
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                </select>
              </div>

              <div className="campo">
                <label htmlFor="raca"><FaBone /> Raça</label>
                <select id="raca" name="raca" required disabled={!racas.length}>
                  <option value="">Selecione...</option>
                  {racas.map((raca, index) => (
                    <option key={index} value={raca}>{raca}</option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label htmlFor="data-nascimento"><FaCalendar /> Data de Nascimento Estimada</label>
                <input type="date" 
                            id="data-nascimento" 
                            name="data-nascimento" 
                            required 
                            min="2000-01-01" 
                            max={new Date().toISOString().split("T")[0]}  />
              </div>

              <div className="campo">
                <label><FaVenusMars /> Sexo</label>
                <div className="opcoes-sexo">
                  <label><input type="radio" name="sexo" value="macho" required /> Macho</label>
                  <label><input type="radio" name="sexo" value="femea" /> Fêmea</label>
                </div>
              </div>

              <div className="campo">
                <label><FaArrowsUpDownLeftRight /> Porte</label>
                <div className="opcoes-porte">
                  <label><input type="radio" name="porte" value="pequeno" required /> Pequeno</label>
                  <label><input type="radio" name="porte" value="medio" /> Médio</label>
                  <label><input type="radio" name="porte" value="grande" /> Grande</label>
                </div>
              </div>

              <div className="campo">
                <label htmlFor="foto-pet"><FaCamera /> Foto do Pet</label>
                <input type="file" id="foto-pet" name="foto-pet" accept="image/*" onChange={previewImage} />
                {preview && <img src={preview} alt="Pré-visualização do Pet" id="preview" />}
              </div>
            </div>

            <div className="botoes">
              <button type="submit" className="btn azul">
                <FaCheck /> Cadastrar
              </button>
              <button type="reset" className="btn preto">
                <FaXmark /> Cancelar
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
