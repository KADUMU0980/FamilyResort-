import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectToDatabase();

        const email = credentials.email.trim().toLowerCase();
        const { password } = credentials;

        const user = await userModel.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        if (user.provider === "google" || !user.password) {
          throw new Error("This account uses Google sign-in. Please use Google to log in.");
        }
        if (!user.provider) {
          await userModel.updateOne(
            { _id: user._id },
            { $set: { provider: "credentials" } }
          );
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        const email = (user?.email || profile?.email || "")
          .trim()
          .toLowerCase();
        if (!email) {
          return false;
        }

        const existing = await userModel.findOne({ email });
        const picture = user.image || profile?.picture || "";
        if (!existing) {
          await userModel.create({
            name: user.name || profile?.name || "User",
            email,
            password: null,
            provider: "google",
            role: "user",
            image: picture,
            phone: "",
          });
        } else if (picture && picture !== existing.image) {
          await userModel.updateOne(
            { _id: existing._id },
            { $set: { image: picture, provider: "google" } }
          );
        } else if (!existing.provider) {
          await userModel.updateOne(
            { _id: existing._id },
            { $set: { provider: "google" } }
          );
        }
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        if (account?.provider === "credentials") {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.role = user.role || "user";
          return token;
        }

        if (account?.provider === "google") {
          await connectToDatabase();
          const email = (user.email || profile?.email || "")
            .trim()
            .toLowerCase();
          const dbUser = email
            ? await userModel.findOne({ email })
            : null;
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.role = dbUser.role || "user";
            token.picture =
              dbUser.image || user.image || profile?.picture || "";
          }
          return token;
        }
      }

      if (!token.id && token.email) {
        await connectToDatabase();
        const dbUser = await userModel.findOne({ email: String(token.email).toLowerCase() });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role || "user";
          token.name = dbUser.name;
          token.picture = dbUser.image || token.picture;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
        if (token.picture) {
          session.user.image = token.picture;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
