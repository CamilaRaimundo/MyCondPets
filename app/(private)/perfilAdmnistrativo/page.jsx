// page.jsx
"use client";

import React, { useState } from 'react';
import { Shield, Users, Lock, UserCheck, UserX, Home, LogOut } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import './css/perfilAdministrativo.css';

// Dados mockados
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin Master',
    email: 'admin@condominio.com',
    apartment: '101',
    isAdmin: true,
    isMaster: true,
    pets: 2,
    joinedDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    apartment: '205',
    isAdmin: true,
    isMaster: false,
    pets: 1,
    joinedDate: '2023-03-20'
  },
  {
    id: 3,
    name: 'João Santos',
    email: 'joao.santos@email.com',
    apartment: '308',
    isAdmin: false,
    isMaster: false,
    pets: 3,
    joinedDate: '2023-06-10'
  },
  {
    id: 4,
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    apartment: '102',
    isAdmin: false,
    isMaster: false,
    pets: 1,
    joinedDate: '2023-08-05'
  },
  {
    id: 5,
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    apartment: '410',
    isAdmin: false,
    isMaster: false,
    pets: 2,
    joinedDate: '2024-01-12'
  }
];

const CONDOMINIO_INFO = {
  name: 'Residencial Jardim das Flores',
  totalApartments: 120,
  totalPets: 45
};

export default function AdminPanel() {
  // Simulação de autenticação - na aplicação real viria do backend/context
  const [currentUser] = useState({
    id: 1,
    name: 'Admin Master',
    isAdmin: true,
    isMaster: true,
    condominioId: 1
  });

  const [users, setUsers] = useState(MOCK_USERS);
  const [isAuthenticated] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Verificação de acesso
  if (!isAuthenticated || !currentUser.isAdmin) {
    return (
      <div className="unauthorized-container">
        <Lock size={64} color="#e74c3c" />
        <h1 className="unauthorized-title">Acesso Negado</h1>
        <p className="unauthorized-text">
          Você não tem permissão para acessar esta página.
        </p>
        <p className="unauthorized-subtext">
          Apenas administradores podem visualizar o painel de controle.
        </p>
      </div>
    );
  }

  const toggleAdminPermission = (userId) => {
    const user = users.find(u => u.id === userId);
    
    // Não permite remover permissão do master
    if (user.isMaster) {
      alert('O usuário Master não pode ter suas permissões alteradas!');
      return;
    }

    setUsers(users.map(u => 
      u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u
    ));
  };

  const filteredUsers = users.filter(user => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'admins') return user.isAdmin;
    if (selectedFilter === 'users') return !user.isAdmin;
    return true;
  });

  const stats = {
    totalUsers: users.length,
    totalAdmins: users.filter(u => u.isAdmin).length,
    totalRegularUsers: users.filter(u => !u.isAdmin).length
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <Home size={28} color="#3498db" />
          <div className="header-info">
            <h1 className="header-title">Painel Administrativo</h1>
            <p className="header-subtitle">{CONDOMINIO_INFO.name}</p>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <Shield size={20} color="#f39c12" />
            <span className="user-name">{currentUser.name}</span>
            {currentUser.isMaster && (
              <span className="master-badge">MASTER</span>
            )}
          </div>
          <button className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <Users size={32} color="#3498db" />
          <div className="stat-info">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Total de Usuários</span>
          </div>
        </div>
        <div className="stat-card">
          <Shield size={32} color="#2ecc71" />
          <div className="stat-info">
            <span className="stat-value">{stats.totalAdmins}</span>
            <span className="stat-label">Administradores</span>
          </div>
        </div>
        <div className="stat-card">
          <UserCheck size={32} color="#9b59b6" />
          <div className="stat-info">
            <span className="stat-value">{stats.totalRegularUsers}</span>
            <span className="stat-label">Usuários Comuns</span>
          </div>
        </div>
        <div className="stat-card">
          <Home size={32} color="#e67e22" />
          <div className="stat-info">
            <span className="stat-value">{CONDOMINIO_INFO.totalPets}</span>
            <span className="stat-label">Total de Pets</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <button
          className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          Todos
        </button>
        <button
          className={`filter-btn ${selectedFilter === 'admins' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('admins')}
        >
          Administradores
        </button>
        <button
          className={`filter-btn ${selectedFilter === 'users' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('users')}
        >
          Usuários Comuns
        </button>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th>Usuário</th>
              <th>Apartamento</th>
              <th>Pets</th>
              <th>Data de Cadastro</th>
              <th>Permissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="table-row">
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-cell-name">{user.name}</div>
                      <div className="user-cell-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="apartment-badge">Apto {user.apartment}</span>
                </td>
                <td>
                  <span className="pets-badge">{user.pets} pet(s)</span>
                </td>
                <td>
                  {new Date(user.joinedDate).toLocaleDateString('pt-BR')}
                </td>
                <td>
                  {user.isMaster ? (
                    <span className="master-label">
                      <Shield size={16} />
                      MASTER
                    </span>
                  ) : user.isAdmin ? (
                    <span className="admin-label">
                      <UserCheck size={16} />
                      Admin
                    </span>
                  ) : (
                    <span className="user-label">
                      <Users size={16} />
                      Usuário
                    </span>
                  )}
                </td>
                <td>
                  {user.isMaster ? (
                    <button className="btn-disabled" disabled>
                      <Lock size={16} />
                      Protegido
                    </button>
                  ) : user.isAdmin ? (
                    <button
                      className="btn-remove-admin"
                      onClick={() => toggleAdminPermission(user.id)}
                    >
                      <UserX size={16} />
                      Remover Admin
                    </button>
                  ) : (
                    <button
                      className="btn-add-admin"
                      onClick={() => toggleAdminPermission(user.id)}
                    >
                      <UserCheck size={16} />
                      Tornar Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}