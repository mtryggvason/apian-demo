import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    name: string;
    picture: string;
    access_token: string;
    user: UserProfile;
    ref: number;
  }
  interface JWT {
    user?: UserProfile;
  }
}

export interface UserProfile {
  code: string;
  email: string;
  profile: string;
}

declare module "next-auth/jwt" {
  interface JWT {
    ref: number;
  }
}
