"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Bot, User } from 'lucide-react';
import "./styles.css";

export function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Olá! 👋 Sou o assistente virtual do condomínio. Selecione uma opção abaixo:',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef(null);

  // Busca os dados do dashboard quando o componente monta
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (response.ok) {
          const data = await response.json();
          setDashboardData({
            totalPets: data.petsCadastrados,
            petsLost: data.petsPerdidos,
            totalOwners: data.donosCadastrados,
            apartmentsWithPets: data.aptosComPets
          });
        }
      } catch (error) {
        console.error(' Erro ao carregar dados no Footer:', error);
      }
    };

    fetchDashboardData();
  }, []);

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

Dados atualizados em tempo real do nosso sistema de controle!`,

    register: `🐕 Cadastro de Pets no Condomínio:

O sistema permite o cadastro completo de todos os pets do condomínio, incluindo:

• Nome e dados do pet
• Raça e características
• Informações do proprietário
• Foto do animal
• Número do apartamento

Isso facilita a identificação e controle de todos os animais residentes no condomínio.`,

    lost: `🚨 Sistema de Pets Perdidos:

Nosso sistema possui um módulo especial para reportar pets perdidos:

• Registro rápido de desaparecimento
• Notificação para todos os moradores
• Informações de última localização
• Sistema de alertas em tempo real

Em caso de pet perdido, o alerta é enviado imediatamente para toda a comunidade!`,

    news: `📰 Central de Notícias do Condomínio:

O card "Notícias" dá acesso às informações importantes:

• Comunicados da administração
• Avisos sobre pets
• Regras e regulamentos
• Eventos do condomínio

Mantenha-se informado sobre tudo que acontece em nosso condomínio!`,

    apartments: `🏠 Controle de Apartamentos:

Atualmente temos ${dashboardData?.apartmentsWithPets || 0} apartamentos com pets cadastrados.

O sistema mantém registro de:

• Quais apartamentos possuem pets
• Quantidade de animais por unidade
• Informações dos proprietários
• Histórico de cadastros

Isso garante organização e segurança para todos!`,

    help: `❓ Sobre o Sistema:

Este é um sistema completo de controle de pets em condomínios, oferecendo:

🐕 **Gestão de Pets**: Cadastro e acompanhamento de todos os animais
🚨 **Alertas**: Sistema para pets perdidos com notificação instantânea
👥 **Proprietários**: Controle de donos e responsáveis
🏠 **Unidades**: Monitoramento por apartamento
📰 **Comunicação**: Central de notícias e avisos

Tudo para garantir segurança e organização!`,

    contact: `📞 Informações de Contato:

**Condomínio Residencial Jardim das Flores**
📍 Rua das Acácias, 245 - Jardim Paulista
📍 São Paulo - SP, CEP 01452-000

**Administração:**
📧 Email: admin@condjardimdflores.com.br
📱 Telefone: (11) 3456-7890
📱 WhatsApp: (11) 98765-4321
⏰ Horário: Segunda a Sexta, 8h às 18h
⏰ Sábado: 8h às 12h

**Portaria 24h:**
📱 (11) 3456-7891

**Síndico:**
👤 Sr. Roberto Silva
📧 sindico@condjardimdflores.com.br
📱 (11) 97654-3210

**Emergências Veterinárias:**
🏥 Clínica VetCare 24h
📱 (11) 3333-4444
📍 A 2 km do condomínio`
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