import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import clientPromise from "./mongodb";
import { comparePassword } from "./password";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db(process.env.DATABASE_NAME);
                const user = await db.collection("users").findOne({
                    email: credentials.email,
                });
                if (!user) return null;
                const valid = await comparePassword(
                    credentials.password,
                    user.password
                );
                if (!valid) return null;
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});