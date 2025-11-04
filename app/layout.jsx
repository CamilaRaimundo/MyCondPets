import "./globals.css";
import { Header } from '../components/header'
import { Footer } from "@/components/footer";
import AuthProvider from "./authProvider/auth";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <Header/>
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
