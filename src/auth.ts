import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { signInSchema } from "./lib/zod";
import { HOST } from "./lib/consts";

async function getUser(username: string, password: string) {
  try {
    const response = await fetch(`${HOST}/ru/data/v3/testmethods/docs/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const token = (await response.json()).data.token;
    // Необходимый костыль из условий таска
    return { email: token, name: username } as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username, password);
          if (!user) return null;
          return user;
        }
        return null;
      },
    }),
  ],
});
