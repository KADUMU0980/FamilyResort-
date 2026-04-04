import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserNavigation from "../UserNavigation";
import SiteFooter from "../SiteFooter";

export default async function SiteLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen flex-col bg-luxury-cream">
      <UserNavigation
        userName={session?.user?.name || ""}
        isAdmin={session?.user?.role === "admin"}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
