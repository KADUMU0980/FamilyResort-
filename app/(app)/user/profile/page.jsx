import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
  const user = await userModel.findOne({ email: session.user.email });

  return (
    <UserProfile
      userName={session.user.name}
      userEmail={session.user.email}
      userPhone={user?.phoneNumber || ""}
    />
  );
}