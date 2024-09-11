import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return false;
      } else if (!isLoggedIn) {
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Необходимый костыль из условий таска
        token.accessToken = user.email
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
