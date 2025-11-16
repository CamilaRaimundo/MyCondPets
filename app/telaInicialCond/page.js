"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Home, Dog, AlertCircle, Bone, Newspaper } from "lucide-react";
import "./css/telaInicial.css";

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

export default function TelaInicialCond() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // COMENTADO: Validação de autenticação
    // if (status === "loading") return;
    
    // if (!session) {
    //   router.push("/login");
    //   return;
    // }
    
    // Carrega os dados independente de estar logado ou não
    loadData();
  }, []); // Removido as dependências para evitar loop infinito

  const loadData = async () => {
    try {
      setLoading(true);
      
      // COMENTADO: Tentativa de buscar da API
      // const response = await fetch('/api/dashboard');
      // if (response.ok) {
      //   const dashboardData = await response.json();
      //   setData(dashboardData);
      // } else {
      
      // Usa dados mockados direto
      setData({
        totalPets: 34,
        petsLost: 1,
        totalOwners: 40,
        apartmentsWithPets: 40,
        recentNews: []
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Usa dados mockados em caso de erro
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

  // COMENTADO: Validação de loading
  // if (status === "loading" || loading) {
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
        {/* Top Cards Grid */}
        <div className="cards-grid-top">
          {/* Rota: /pets - Crie: app/pets/page.jsx */}
          <DashboardCard
            icon={Dog}
            title="Pets cadastrados"
            value={data.totalPets}
            color="card-teal"
            onClick={() => handleNavigation('/pets')}
          />
          
          {/* Rota: /pets-perdidos - Crie: app/pets-perdidos/page.jsx */}
          <DashboardCard
            icon={AlertCircle}
            title="Pets perdidos"
            value={data.petsLost}
            color="card-red"
            onClick={() => handleNavigation('/pets-perdidos')}
            alert={data.petsLost > 0}
          />
          
          {/* Rota: /donos - Crie: app/donos/page.jsx */}
          <DashboardCard
            icon={Bone}
            title="Donos cadastrados"
            value={data.totalOwners}
            color="card-dark-teal"
            onClick={() => handleNavigation('/donos')}
          />
        </div>

        {/* Bottom Cards Grid */}
        <div className="cards-grid-bottom">
          {/* Rota: /apartamentos - Crie: app/apartamentos/page.jsx */}
          <InfoCard
            value={data.apartmentsWithPets}
            label="Apartamentos com pets"
            onClick={() => handleNavigation('/apartamentos')}
          />
          
          {/* Rota: /noticias - Crie: app/noticias/page.jsx */}
          <NewsCard onClick={() => handleNavigation('/noticias')} />
        </div>
      </main>

    </div>
  );
}