import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AddProduct from "../components/AddProduct";
import AdminNav from "../components/AdminNav";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen bg-luxury-cream">
      <AdminNav userName={session.user.name} />
      <main className="min-h-screen flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <AddProduct />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
