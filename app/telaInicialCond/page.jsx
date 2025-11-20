"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Dog, AlertCircle, Bone, Newspaper } from 'lucide-react';
import "./css/telaInicial.css";

// Componente de Card do Dashboard
const DashboardCard = ({ icon: Icon, title, value, color, onClick, alert }) => (
  <div
    onClick={onClick}
    className={`dashboard-card ${color} ${alert ? 'alert-card' : ''}`}
  >
    {alert && (
      <div className="alert-icon">
        <AlertCircle className="w-8 h-8 text-white animate-pulse" />
      </div>
    )}
    <div className="card-content">
      <Icon className="card-icon" />
      <div className="card-value">{value}</div>
      <div className="card-title">{title}</div>
      <button className="card-button">
        {alert ? 'Ver Detalhes' : 'Detalhes'}
      </button>
    </div>
  </div>
);

const InfoCard = ({ value, label, onClick }) => (
  <div onClick={onClick} className="info-card">
    <div className="info-value">{value}</div>
    <div className="info-label">{label}</div>
  </div>
);

const NewsCard = ({ onClick }) => (
  <div onClick={onClick} className="news-card">
    <div className="news-content">
      <Newspaper className="news-icon" />
      <div className="news-title">Notícias</div>
    </div>
    <button className="news-button">Ver todas</button>
  </div>
);

// Componente Principal
export default function TelaInicialCond() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Usa dados mockados
      setData({
        totalPets: 34,
        petsLost: 1,
        totalOwners: 40,
        apartmentsWithPets: 40,
        recentNews: []
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setData({
        totalPets: 34,
        petsLost: 1,
        totalOwners: 40,
        apartmentsWithPets: 40,
        recentNews: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (route) => {
    router.push(route);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Carregando...</p>
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
            onClick={() => handleNavigation('/pets')}
          />
          
          <DashboardCard
            icon={AlertCircle}
            title="Pets perdidos"
            value={data.petsLost}
            color="card-red"
            onClick={() => handleNavigation('/pets-perdidos')}
            alert={data.petsLost > 0}
          />
          
          <DashboardCard
            icon={Bone}
            title="Donos cadastrados"
            value={data.totalOwners}
            color="card-dark-teal"
            onClick={() => handleNavigation('/donos')}
          />
        </div>

        <div className="cards-grid-bottom">
          <InfoCard
            value={data.apartmentsWithPets}
            label="Apartamentos com pets"
            onClick={() => handleNavigation('/apartamentos')}
          />
          
          <NewsCard onClick={() => handleNavigation('/noticias')} />
        </div>
      </main>
    </div>
  );
}