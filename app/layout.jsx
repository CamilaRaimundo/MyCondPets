import "./globals.css";
import { Header } from '../components/header'
import { Footer } from "@/components/footer";
import AuthProvider from "./authProvider/auth";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <Header />

          <script src="https://kit.fontawesome.com/58c0554857.js" crossOrigin="anonymous"></script>

          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
