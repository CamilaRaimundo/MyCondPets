"use client";

import "./styles.css";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (session?.user && !session.user.cpf && pathname !== "/perfilDono") {
  //     router.push("/perfilDono");
  //   }
  // }, [session, pathname, router]);

  if (status === "loading") {
    return (
      <div className="carregando">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <Link href={'/'}><img src="../images/logo/logo_fundo-removebg.png" alt="Logo MyCondPets" className="logo" /></Link>

        {session ? (
          <>
            <nav className="menu">
              <Link href={'/telaInicialCond'} className="navega-item">Tela Inicial (Condomínio)</Link>
              <Link href={'/noticias'} className="navega-item">Notícias</Link>
              <Link href={'/perfilDono'} className="navega-item">Perfil</Link>
              <Link href={'/pets'} className="navega-item">Pets</Link>
            </nav>
            <button className="logout-btn" onClick={() => signOut()}>Sair</button>
          </>
        ) : (
          <Link className="login-btn" href={'/login'}>Login</Link>
        )}
      </header>
    </div>
  );
}