import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Email or Phone", type: "text", placeholder: "Enter Your Email or Phone Number" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const res = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password,
                    }),
                });
                const user = await res.json();
                if (user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                await fetch("http://localhost:3000/api/allusers",
                    {
                        method: 'GET',
                        redirect: 'follow'
                    })
                    .then(response => response.text())
                    .then(async result => {
                        var newUser = JSON.parse(result).find((user: { email_phone: string; }) => user.email_phone === profile?.email);
                        if (newUser === undefined) {
                            await fetch("http://localhost:3000/api/user", {
                                method: 'POST',
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    "email_phone": `${profile?.email}`,
                                    "name": `${profile?.name}`,
                                    "password": null,
                                    "provider":"Google"
                                }),
                                redirect: 'follow'
                            })
                                .then(response => response.text())
                                .then(result => console.log(result))
                                .catch(error => console.log('error', error));
                        }
                    })
                    .catch(error => console.log('error', error));
            }
            return true 
        },
        async jwt({ token, user }) {
            return { ...token, ...user };
        },

        async session({ session, token }) {
            session.user = token as any;
            return session;
        },
    },
});

export { handler as GET, handler as POST };
