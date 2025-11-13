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
        )
    }

    return (
        <div>
            <header className="header">
                <Link href={'/'}><img src="../images/logo/logo_fundo-removebg.png" alt="Logo MyCondPets" className="logo" /></Link>

                {session ? (
                    <>
                        <nav className="menu">
                            <Link href={'/'} className="navega-item">Notícias</Link>
                            <Link href={'/perfilDono'} className="navega-item">Perfil</Link>
                            <Link href={'/'} className="navega-item">Pets</Link>
                        </nav>
                        <button className="logout-btn" onClick={() => signOut()}>Sair</button>
                    </>
                ) : (
                    <Link className="login-btn" href={'/login'}>Login</Link>
                )}
            </header>

        </div>
    )
}