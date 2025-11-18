"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Bot, User } from 'lucide-react';
import "./styles.css";

export function Footer({ dashboardData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Olá! 👋 Sou o assistente virtual do condomínio. Selecione uma opção abaixo:',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Respostas pré-definidas
  const predefinedResponses = {
    stats: `📊 Estatísticas do Sistema:

🐕 Pets cadastrados: ${dashboardData?.totalPets || 0}
🚨 Pets perdidos: ${dashboardData?.petsLost || 0}
👥 Donos cadastrados: ${dashboardData?.totalOwners || 0}
🏠 Apartamentos com pets: ${dashboardData?.apartmentsWithPets || 0}

Tudo atualizado em tempo real!`,

    register: `🐕 Como Cadastrar um Pet:

1. Clique no card "Pets cadastrados"
2. Clique em "Adicionar Novo Pet"
3. Preencha os dados do pet
4. Adicione uma foto (opcional)
5. Clique em "Salvar"

Pronto! Seu pet estará cadastrado! ✅`,

    lost: `🚨 Como Reportar Pet Perdido:

1. Clique no card vermelho "Pets perdidos"
2. Clique em "Reportar Pet Perdido"
3. Selecione seu pet da lista
4. Informe local e data
5. Clique em "Enviar Alerta"

Todos os moradores serão notificados! 📢`,

    news: `📰 Como Ver Notícias:

1. Clique no card "Notícias"
2. Veja todas as notícias recentes
3. Avisos importantes aparecem primeiro

Fique sempre atualizado! 🔔`,

    apartments: `🏠 Apartamentos com Pets:

Atualmente temos ${dashboardData?.apartmentsWithPets || 0} apartamentos com pets cadastrados.

Para ver detalhes:
1. Clique no card "Apartamentos com pets"
2. Veja a lista completa

Informações sempre atualizadas! 📋`,

    help: `❓ Ajuda do Sistema:

Principais Funcionalidades:

🐕 Pets: Cadastro e gerenciamento
🚨 Alertas: Sistema de pets perdidos
👥 Donos: Informações dos proprietários
🏠 Apartamentos: Controle por unidade
📰 Notícias: Avisos e comunicados

Selecione qualquer opção para saber mais!`,

    contact: `📞 Contato e Suporte:

Administração do Condomínio:
📧 Email: admin@petcondo.com.br
📱 WhatsApp: (11) 9999-9999
⏰ Seg a Sex, 8h às 18h

Emergências Veterinárias:
🏥 Clínica Pet Care
📱 (11) 8888-8888
🕐 Disponível 24h`
  };

  const quickActions = [
    { text: '📊 Estatísticas', action: 'stats' },
    { text: '🐕 Cadastrar Pet', action: 'register' },
    { text: '🚨 Pet Perdido', action: 'lost' },
    { text: '📰 Notícias', action: 'news' },
    { text: '🏠 Apartamentos', action: 'apartments' },
    { text: '❓ Ajuda', action: 'help' },
    { text: '📞 Contato', action: 'contact' }
  ];

  const handleQuickAction = (action) => {
    const actionTitles = {
      stats: '📊 Estatísticas',
      register: '🐕 Cadastrar Pet',
      lost: '🚨 Pet Perdido',
      news: '📰 Notícias',
      apartments: '🏠 Apartamentos',
      help: '❓ Ajuda',
      contact: '📞 Contato'
    };

    setMessages(prev => [...prev, {
      type: 'user',
      text: actionTitles[action],
      timestamp: new Date()
    }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: predefinedResponses[action],
        timestamp: new Date()
      }]);
    }, 300);
  };

  return (
    <>
      {/* Chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-toggle"
          aria-label="Abrir chat"
        >
          <MessageCircle className="chatbot-icon" />
          <span className="chatbot-badge">AI</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <Bot className="chatbot-icon" />
              </div>
              <div>
                <h3 className="chatbot-header-title">Assistente Virtual</h3>
                <p className="chatbot-header-subtitle">Sempre online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-close"
              aria-label="Fechar chat"
            >
              <X className="chatbot-icon" />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.type === 'user' ? (
                    <User className="chatbot-icon-small" />
                  ) : (
                    <Bot className="chatbot-icon-small" />
                  )}
                </div>
                <div className="message-content">
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="quick-action-btn"
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé */}
      <footer className="footer">
        Copyright - 2025
      </footer>
    </>
  );
}