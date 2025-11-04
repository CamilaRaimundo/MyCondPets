"use client";
import "./styles.css";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session?.user && !session.user.cpf && pathname !== "/perfilDono") {
      router.push("/perfilDono");
    }
  }, [session, pathname, router]);

  return (
    <div>
      <header className="header">
        <Link href={'/'}>
          <img src="../images/logo/logo_fundo-removebg.png" alt="Logo MyCondPets" className="logo" />
        </Link>
        {session ? (
          <nav>
            <button className="logout-btn" onClick={() => signOut()}>Sair</button>
          </nav>
        ) : (
          <Link className="login-btn" href={'/login'}>Login</Link>
        )}
      </header>
    </div>
  );
}