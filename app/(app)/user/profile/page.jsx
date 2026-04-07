import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import UserProfile from "@/app/components/UserProfile"; // Adjust path as needed
import userModel from "@/app/utils/models/userModel";
import connectToDatabase from "@/app/utils/configue/db";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login-required");
  }

  await connectToDatabase();
  const user = await userModel.findById(session.user.id);
  const displayPhone = (user?.phone || "").trim() || "—";

  return (
    <UserProfile
      userName={session.user.name}
      userEmail={session.user.email}
      userPhone={displayPhone}
      userImage={user?.image || session.user?.image || ""}
      canChangePassword={user?.provider !== "google"}
    />
  );
}
