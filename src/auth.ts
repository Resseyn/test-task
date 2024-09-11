import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { saltAndHashPassword } from "@/utils/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = null;

        const pwHash = saltAndHashPassword(credentials.password);

        // TODO: user = await getUserFromDb(credentials.email, pwHash);

        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      },
    }),
  ],
});
