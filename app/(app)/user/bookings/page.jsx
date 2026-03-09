import MyReservations from "../../../components/MyReservations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


const BookingPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login-required");
  }

  return (
    <div>
      <MyReservations />
    </div>
  )
}
export default BookingPage;