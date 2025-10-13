import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { Role } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            patient: true,
            provider: true
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password)
        
        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
      }

      // If signing in with OAuth for the first time, set default role to PATIENT
      if (account && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! }
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as Role
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, ensure user has a role
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        // If it's a new OAuth user, create patient record
        if (!existingUser) {
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              role: Role.PATIENT,
              patient: {
                create: {
                  firstName: user.name?.split(" ")[0] || "",
                  lastName: user.name?.split(" ").slice(1).join(" ") || "",
                  email: user.email!
                }
              }
            }
          })
        }
      }
      return true
    }
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/auth/error"
  }
}

// Utility function to check if user has required role
export function hasRequiredRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole)
}

// Role hierarchy for permissions
export const ROLE_PERMISSIONS = {
  [Role.ADMIN]: ["*"], // Admin has all permissions
  [Role.FRONT_DESK]: [
    "appointments:read",
    "appointments:create", 
    "appointments:update",
    "patients:read",
    "patients:update",
    "intake:read",
    "intake:update"
  ],
  [Role.PROVIDER]: [
    "appointments:read",
    "appointments:update", 
    "patients:read",
    "intake:read",
    "availability:create",
    "availability:update"
  ],
  [Role.PATIENT]: [
    "appointments:create",
    "appointments:read:own",
    "intake:create:own",
    "intake:update:own"
  ]
}

export function hasPermission(userRole: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole]
  return permissions.includes("*") || permissions.includes(permission)
}