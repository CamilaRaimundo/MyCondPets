"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!session ? (
        <>
          <h2>Você não está logado</h2>
          <button onClick={() => signIn("google")}>Entrar com Google</button>
        </>
      ) : (
        <>
          <h2>Bem-vindo, {session.user.name}</h2>
          <img src={session.user.image} alt="Foto de perfil" width={50} />
          <br />
          <button onClick={() => signOut()}>Sair</button>
        </>
      )}
    </div>
  );
}