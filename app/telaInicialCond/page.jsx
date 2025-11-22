"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Dog, AlertCircle, Bone, Newspaper } from 'lucide-react';
import "./css/telaInicial.css";

// Componente de Card do Dashboard
const DashboardCard = ({ icon: Icon, title, value, color, alert }) => (
  <div className={`dashboard-card ${color} ${alert ? 'alert-card' : ''}`}>
    {alert && (
      <div className="alert-icon">
        <AlertCircle className="w-8 h-8 text-white animate-pulse" />
      </div>
    )}
    <div className="card-content">
      <Icon className="card-icon" />
      <div className="card-value">{value}</div>
      <div className="card-title">{title}</div>
    </div>
  </div>
);

const InfoCard = ({ value, label }) => (
  <div className="info-card">
    <div className="info-value">{value}</div>
    <div className="info-label">{label}</div>
  </div>
);

const NewsCard = () => (
  <div className="news-card">
    <div className="news-content">
      <Newspaper className="news-icon" />
      <div className="news-title">Notícias</div>
    </div>
    <Link href={'/noticias'} className="news-button">
      Ver todas
    </Link>
  </div>
);

// Componente Principal
export default function TelaInicialCond() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      // Chama a API do dashboard
      const response = await fetch('/api/dashboard');
      
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(' Erro da API:', errorData);
        throw new Error(errorData.details || 'Erro ao carregar dados do servidor');
      }
      
      const dashboardData = await response.json();
      
      // Mapeia os dados da API para o formato esperado pelo componente
      setData({
        totalPets: dashboardData.petsCadastrados,
        petsLost: dashboardData.petsPerdidos,
        totalOwners: dashboardData.donosCadastrados,
        apartmentsWithPets: dashboardData.aptosComPets,
        recentNews: []
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError(error.message);
      
      // Em caso de erro, usa dados de fallback
      setData({
        totalPets: 0,
        petsLost: 0,
        totalOwners: 0,
        apartmentsWithPets: 0,
        recentNews: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle className="error-icon" />
        <p className="error-text">Erro ao carregar dados: {error}</p>
        <button onClick={loadData} className="retry-button">
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="tela-inicial-wrapper">
      {/* Main Content */}
      <main className="tela-inicial-main">
        <div className="cards-grid-top">
          <DashboardCard
            icon={Dog}
            title="Pets cadastrados"
            value={data.totalPets}
            color="card-teal"
          />
          <DashboardCard
            icon={AlertCircle}
            title="Pets perdidos"
            value={data.petsLost}
            color="card-red"
            alert={data.petsLost > 0}
          />
          <DashboardCard
            icon={Bone}
            title="Donos cadastrados"
            value={data.totalOwners}
            color="card-dark-teal"
          />
        </div>

        <div className="cards-grid-bottom">
          <InfoCard
            value={data.apartmentsWithPets}
            label="Apartamentos com pets"
          />
          <NewsCard />
        </div>
      </main>
    </div>
  );
}