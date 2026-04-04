import ManageResorts from "../../components/ManageResorts";
import AdminNav from "../../components/AdminNav";

const ManageResortsPage = async () => {
  return (
    <div className="flex min-h-screen bg-luxury-cream">
      <AdminNav />
      <main className="min-h-screen flex-1 overflow-auto">
        <ManageResorts />
      </main>
    </div>
  );
};

export default ManageResortsPage;
