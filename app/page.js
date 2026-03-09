
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserNavigation from "./components/UserNavigation";
import ProductCollection from "./components/ProductCollection";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  console.log("Session:", session);

  if (!session) {
    redirect("/login");
  }

  // Admin redirect BEFORE JSX
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <>
      <div className="text-3xl p-4">
        <UserNavigation userName={session.user.name} />
        
      </div>

      <ProductCollection />
    </>
  );
}
