import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { buscaOuCriaDono } from "@/app/_lib/actions/buscaOuCriaDono";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {

    async signIn({ user, account }) {
      if (account.provider === "google") {
        if (!user.email || !user.name) {
          return false; 
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user && account) {
        if (account.provider === "google") {
          try {
            const { dono } = await buscaOuCriaDono(user.email, user.name);
            
            if (!dono) {
              throw new Error("Não foi possível encontrar ou criar o dono.");
            }

            token.id = dono.don_id;
            token.cpf = dono.don_cpf;
            
          } catch (error) {
            console.error("Erro no callback JWT:", error);
            token.error = "LoginError";
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.error) {
        return null;
      }
      session.user.id = token.id || null;
      session.user.cpf = token.cpf || null;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };