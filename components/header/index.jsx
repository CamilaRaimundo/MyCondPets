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
  const isAdmin = session?.user?.email === "mycondpets@gmail.com";

  return (
    <div>
      <header className="header">
        <Link href="/">
          <img 
            src="../images/logo/logo_fundo-removebg.png" 
            alt="Logo MyCondPets" 
            className="logo" 
          />
        </Link>

        {session ? (
          <>
            {perfilCompleto || isAdmin ? (
              <nav className="menu">

                {/* Sempre aparece para quem tem perfil completo OU admin */}
                <Link href="/noticias" className="navega-item">
                  Notícias
                </Link>
                <Link href="/perfilDono" className="navega-item">
                  Perfil
                </Link>

                {/* Só aparece para admin */}
                {isAdmin && (
                  <>
                    <Link href="/detalhesPets" className="navega-item">
                      Pets
                    </Link>
                    <Link href="/telaInicialCond" className="navega-item">
                      Dashboard
                    </Link>
                  </>
                )}

              </nav>
            ) : (
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
          <Link className="login-btn" href="/login">Login</Link>
        )}
      </header>
    </div>
  );
}
