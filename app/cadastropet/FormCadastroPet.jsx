"use client";

import { useState } from "react";
import { FaPaw, FaBone, FaCalendar, FaVenusMars, FaArrowsUpDownLeftRight, FaCamera, FaCheck, FaXmark } from "react-icons/fa6";
import { cadastrarPet } from "./actions";

export default function FormCadastroPet({ donoId }) {
    const [preview, setPreview] = useState(null);
    const [especie, setEspecie] = useState("");
    const [racas, setRacas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    const racasPorEspecie = {
        Cachorro: ["Labrador Retriever", "Golden Retriever", "Poodle", "Beagle", "Bulldog", "Pastor Alemão", "Outros"],
        Gato: ["Persa", "Siamês", "Angorá", "Bengal", "Maine Coon", "Ragdoll", "Outros"]
    };

    const handleEspecieChange = (e) => {
        const especieSel = e.target.value;
        setEspecie(especieSel);
        setRacas(racasPorEspecie[especieSel] || []);
    };

    const previewImage = (e) => {
        const file = e.target.files[0];
        if (!file) return setPreview(null);
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);

        try {
            
            const formData = new FormData(e.target);
            formData.append("don_id", donoId);

            console.log("📦 FormData preparado");
            
            const resultado = await cadastrarPet(formData);
            
            console.log("📨 Resposta recebida:", resultado);

            setMensagem({
                tipo: resultado.success ? "sucesso" : "erro",
                texto: resultado.message
            });

            if (resultado.success) {
                e.target.reset();
                setPreview(null);
                setEspecie("");
                setRacas([]);
            }
        } catch (error) {
            console.error("❌ Erro no handleSubmit:", error);
            setMensagem({
                tipo: "erro",
                texto: `Erro: ${error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {mensagem && (
                <div className={`mensagem ${mensagem.tipo}`}>
                    {mensagem.texto}
                </div>
            )}

            <div className="form-grid">
                <div className="campo">
                    <label htmlFor="nome-pet"><FaPaw /> Nome do Pet</label>
                    <input 
                        type="text" 
                        id="nome-pet" 
                        name="nome-pet" 
                        placeholder="Ex: Rex" 
                        required 
                        disabled={loading}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="especie"><FaPaw /> Espécie</label>
                    <select 
                        id="especie" 
                        name="especie" 
                        required 
                        onChange={handleEspecieChange}
                        disabled={loading}
                    >
                        <option value="">Selecione...</option>
                        <option value="Cachorro">Cachorro</option>
                        <option value="Gato">Gato</option>
                    </select>
                </div>

                <div className="campo">
                    <label htmlFor="raca"><FaBone /> Raça</label>
                    <select 
                        id="raca" 
                        name="raca" 
                        required 
                        disabled={!racas.length || loading}
                    >
                        <option value="">Selecione...</option>
                        {racas.map((raca, index) => (
                            <option key={index} value={raca}>{raca}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label htmlFor="data-nascimento"><FaCalendar /> Data de Nascimento Estimada</label>
                    <input 
                        type="date"
                        id="data-nascimento"
                        name="data-nascimento"
                        required
                        min="2000-01-01"
                        max={new Date().toISOString().split("T")[0]}
                        disabled={loading}
                    />
                </div>

                <div className="campo">
                    <label><FaVenusMars /> Sexo</label>
                    <div className="opcoes-sexo">
                        <label>
                            <input 
                                type="radio" 
                                name="sexo" 
                                value="macho" 
                                required 
                                disabled={loading}
                            /> Macho
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="sexo" 
                                value="femea" 
                                disabled={loading}
                            /> Fêmea
                        </label>
                    </div>
                </div>

                <div className="campo">
                    <label><FaArrowsUpDownLeftRight /> Porte</label>
                    <div className="opcoes-porte">
                        <label>
                            <input 
                                type="radio" 
                                name="porte" 
                                value="pequeno" 
                                required 
                                disabled={loading}
                            /> Pequeno
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="porte" 
                                value="medio" 
                                disabled={loading}
                            /> Médio
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="porte" 
                                value="grande" 
                                disabled={loading}
                            /> Grande
                        </label>
                    </div>
                </div>

                <div className="campo">
                    <label htmlFor="foto-pet"><FaCamera /> Foto do Pet</label>
                    <input 
                        type="file" 
                        id="foto-pet" 
                        name="foto-pet" 
                        accept="image/*" 
                        onChange={previewImage}
                        disabled={loading}
                    />
                    {preview && <img src={preview} alt="Pré-visualização do Pet" id="preview" />}
                </div>
            </div>

            <div className="botoes">
                <button type="submit" className="btn azul" disabled={loading}>
                    <FaCheck /> {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
                <button type="reset" className="btn preto" disabled={loading}>
                    <FaXmark /> Cancelar
                </button>
            </div>
        </form>
    );
}