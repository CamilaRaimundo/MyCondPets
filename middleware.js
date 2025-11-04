import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {

    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
      return new NextResponse("Você não tem permissão de admin.");
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token; 
      },
    },
  }
);

// Rotas que precisam de autenticação
export const config = {
  matcher: [
    "/perfilAdmnistrativo",
    "/perfilDono",
  ],
};