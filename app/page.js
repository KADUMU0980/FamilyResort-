import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import SiteLayout from "./components/layout/SiteLayout";
import HomeWithHero from "./components/HomeWithHero";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session && session.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <SiteLayout>
      <HomeWithHero />
    </SiteLayout>
  );
}
