import "./styles.css";
import Link from "next/link";

export function Header(){
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
            </header>
        </div>
    )
}