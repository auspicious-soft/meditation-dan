
import NextAuth, { User, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      fullName: string;
      email: string;
      image?: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    username: string;
    fullName: string;
    profilePic?: string;
    role: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        if (credentials.email) {
          return {
            id: credentials._id || "some-id", // Ensure id is provided
            username: credentials.username,
            fullName: credentials.fullName || "Unknown",
            profilePic: credentials.profilePic,
            role: credentials.role || "user",
          };
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.username;
        token.fullName = user.fullName;
        token.picture = user.profilePic;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.fullName = token.fullName as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true, 
});