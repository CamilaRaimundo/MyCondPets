"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import "./css/login.css";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="login-container">
        <section>
          <div className="image-container">
            <Image
              src="/images/pet23.jpg"
              alt="Imagem de um pet"
              width={300}
              height={300}
              className="image-login"
              priority
            />
          </div>
        </section>

        {!session ? (
          <section>
            <h2>Login</h2>
            <p>Faça login para acessar o sistema de gerenciamento de pets</p>
            <button onClick={() => signIn("google")}>Entrar com Google</button>
          </section>
        ) : (
          <>
              <section>
                <div className="profile-container">
                  <h2>Bem-vindo, {session.user.name}</h2>
                  <img
                    src={session.user.image}
                    alt="Foto de perfil"
                    width={50}
                  />
                  <p>Email: {session.user.email}</p>
                  <p>Status: Logado</p>
                  <p>Sessão iniciada em: {new Date().toLocaleString()}</p>
                  <button onClick={() => signOut()}>Sair</button>
                </div>
              </section>
          </>
        )}
      </div>
    </div>
  );
}
