import "./styles.css";
import Link from "next/link";

export function Header(){
    return(
        <div>
            <header className="header">
                <Link href={'/'}><img src="../images/logo/logo_fundo-removebg.png" alt="Logo MyCondPets" className="logo" /></Link>
                <Link className="login-btn" href={'/login'}>Login</Link>
            </header>
        </div>
    )
}