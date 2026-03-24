import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectToDatabase from "@/app/utils/configue/db";
import userModel from "@/app/utils/models/userModel";
import "@/app/utils/models/bookingModel"; // âœ… Import to register schema
import "@/app/utils/models/productModel"; // âœ… Import to register Product schema
import UsersClient from "./UsersClient";

const GetUsers = async () => {
  // 1ï¸âƒ£ Get session
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg">Unauthorized - Please log in</p>
        </div>
      </div>
    );
  }

  // 2ï¸âƒ£ Only admin can access
  if (session.user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg">Access Denied - Admin only</p>
        </div>
      </div>
    );
  }

  // 3ï¸âƒ£ Connect DB
  await connectToDatabase();

  // 4ï¸âƒ£ Fetch users + FULL booking details
  const users = await userModel
    .find({ role: "user" })
    .select("-password")
    .populate({
      path: "bookings",
      model: "booking", // âœ… Match your model name
      populate: {
        path: "resortRoom",
        model: "Product"
      }
    })
    .lean();

  // 5ï¸âƒ£ Serialize data for client (convert MongoDB objects to plain objects)
  const serializedUsers = JSON.parse(JSON.stringify(users));

  return <UsersClient users={serializedUsers} />;
};

export default GetUsers;

