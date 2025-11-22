"use client";

import "./styles.css";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="carregando">
        <p>Carregando...</p>
      </div>
    );
  }

  const perfilCompleto = session?.user?.perfilCompleto;

  return (
    <div>
      <header className="header">
        <Link href={'/'}>
          <img 
            src="../images/logo/logo_fundo-removebg.png" 
            alt="Logo MyCondPets" 
            className="logo" 
          />
        </Link>

        {session ? (
          <>
            {perfilCompleto ? (
              // Menu completo para usuários com perfil completo
              <nav className="menu">
                <Link href={'/telaInicialCond'} className="navega-item">
                  Tela Inicial (Condomínio)
                </Link>
                <Link href={'/noticias'} className="navega-item">
                  Notícias
                </Link>
                <Link href={'/perfilDono'} className="navega-item">
                  Perfil
                </Link>
                <Link href={'/detalhesPets'} className="navega-item">
                  Pets
                </Link>
                <Link href={'/cadastropet'} className="navega-item">
                  Cadastrar Pet
                </Link>
              </nav>
            ) : (
              // Aviso para usuários com perfil incompleto
              <div className="aviso-perfil">
                <span className="aviso-texto">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  Complete seu perfil para acessar o sistema
                </span>
              </div>
            )}
            
            <button className="logout-btn" onClick={() => signOut()}>
              Sair
            </button>
          </>
        ) : (
          <Link className="login-btn" href={'/login'}>Login</Link>
        )}
      </header>
    </div>
  );
}