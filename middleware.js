import { withAuth } from "next-auth/middleware";

export default withAuth(
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
  ],
};