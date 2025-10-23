"use client";
import "./styles.css";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header(){
      const { data: session } = useSession();
    
    return(
        <div>
            <header className="header">
                <Link href={'/'}><img src="../images/logo/logo_fundo-removebg.png" alt="Logo MyCondPets" className="logo" /></Link>
                <div className="navega">
                    <h3 className="navega-item">Notícias</h3>
                    <Link href={'/perfilDono'} className="navega-item">Perfil</Link>
                    <h3 className="navega-item">Pets</h3>
                </div>
                <Link className="login-btn" href={'/Teste'}>Login</Link>
                {session ? (
                    <nav>
                        <button className="logout-btn" onClick={() => signOut()}>Sair</button>
                    </nav>
                ) :
                    <Link className="login-btn" href={'/login'}>Login</Link>
                }   
            </header>
        </div>
    )
}