"use client";
import React, { useState, useEffect } from 'react';
import { Newspaper, AlertCircle, CheckCircle, Send, X } from 'lucide-react';
import "./css/publicarNoticia.css";

export default function CriarNoticias() {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    donId: ''
  });

  const [donos, setDonos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDonos, setLoadingDonos] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadDonos();
  }, []);

  const loadDonos = async () => {
    try {
      setLoadingDonos(true);
      console.log('🔄 Carregando donos...');

      const response = await fetch('/api/donos');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Erro ao carregar donos');
      }

      const data = await response.json();
      console.log('✅ Donos carregados:', data);
      setDonos(data);

    } catch (error) {
      console.error('❌ Erro ao carregar donos:', error);
      setMessage({
        type: 'error',
        text: 'Erro ao carregar lista de donos: ' + error.message
      });
    } finally {
      setLoadingDonos(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpa mensagem anterior
    setMessage({ type: '', text: '' });

    // Validações síncronas - isso garante que o state seja atualizado antes do async
    if (!formData.titulo.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira um título' });
      return;
    }

    if (!formData.descricao.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira uma descrição' });
      return;
    }

    if (!formData.donId) {
      setMessage({ type: 'error', text: 'Por favor, selecione um dono' });
      return;
    }

    // Se passou nas validações, prossegue com o submit
    try {
      setLoading(true);

      console.log('📤 Enviando notícia:', formData);

      const response = await fetch('/api/noticias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('📥 Resposta:', data);

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Erro ao publicar notícia');
      }

      setMessage({
        type: 'success',
        text: 'Notícia publicada com sucesso!'
      });

      setFormData({
        titulo: '',
        descricao: '',
        donId: ''
      });

      setTimeout(() => {
        window.location.href = '/noticias';
      }, 2000);

    } catch (error) {
      console.error('❌ Erro ao publicar notícia:', error);
      setMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  if (loadingDonos) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="publicar-noticia-wrapper">
      <main className="publicar-noticia-main">
        <div className="form-container">
          <div className="form-header">
            <Newspaper className="header-icon" />
            <h1 className="form-title">Publicar Notícia</h1>
            <p className="form-subtitle">
              Compartilhe informações sobre pets perdidos ou encontrados
            </p>
          </div>

          {message.text && (
            <div className={`message-alert ${message.type}`} role="alert">
              {message.type === 'success' ? (
                <CheckCircle className="message-icon" />
              ) : (
                <AlertCircle className="message-icon" />
              )}
              <span className="message-text">{message.text}</span>
              <button
                onClick={clearMessage}
                className="message-close"
                aria-label="Fechar mensagem"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="noticia-form">
            <div className="form-group">
              <label htmlFor="titulo" className="form-label">
                Título da Notícia *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="form-input"
                placeholder="Ex: Golden Retriever perdido próximo ao bloco A"
                maxLength={200}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao" className="form-label">
                Descrição *
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Descreva detalhes importantes: local, data, características..."
                rows={6}
                maxLength={500}
                required
              />
              <span className="char-count">
                {formData.descricao.length}/500 caracteres
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="donId" className="form-label">
                Publicado por *
              </label>
              <select
                id="donId"
                name="donId"
                value={formData.donId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Selecione o responsável --</option>
                {donos.map((dono) => (
                  <option key={dono.don_id} value={dono.don_id}>
                    {dono.don_nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Publicar Notícia
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}