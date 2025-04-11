import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import axios from "axios";
const axiosPublic = axios.create({
  baseURL: "http://localhost:5000",
});

const handler = NextAuth({
  providers: [
    // OAuth authentication providers...
    GithubProvider({
      clientId:
        process.env.NODE_ENV === "production"
          ? process.env.GITHUB_CLIENT_ID_PROD
          : process.env.GITHUB_CLIENT_ID,
      clientSecret:
        process.env.NODE_ENV === "production"
          ? process.env.GITHUB_CLIENT_SECRET_PROD
          : process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          const response = await axiosPublic.get(`/users/${email}`);
          const user = response.data;
          console.log(user.password);
          if (!user) {
            return null;
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log(passwordMatch, "passwordMatch");
          if (!passwordMatch) {
            return null;
          }
          return user;
        } catch (e) {
          console.log(e);
        }
        return user;
      },
    }),
    // The name to display on the sign in form (e.g. 'Sign in with...')
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/" },
  callbacks: {
    async session({ session }) {
      if (session?.user?.email) {
        try {
          const response = await axiosPublic.get(
            `/users/${session?.user?.email}`
          );
          const updatedUser = response.data;

          session.user.image = updatedUser?.image || session.user.image;
        } catch (error) {
          console.log("Error fetching updated user image:", error);
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
