import Link from "next/link";
import "./globals.css";

export default function NotFound(){
  return(
    <div className="container_404">
      <h1>Página 404 - Não encontrado</h1>

      <Link href={'/'}>
        Voltar para home
      </Link>
    </div>
  )
}