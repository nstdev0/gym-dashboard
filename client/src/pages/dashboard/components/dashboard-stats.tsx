export default function DashboardStats() {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium">Total Members</h3>
        <p className="text-2xl font-bold mt-2">150</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium">Active Memberships</h3>
        <p className="text-2xl font-bold mt-2">120</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium">New Sign-ups This Month</h3>
        <p className="text-2xl font-bold mt-2">30</p>
      </div>
    </div>
  );
}
