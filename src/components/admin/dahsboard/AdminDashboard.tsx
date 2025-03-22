import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  // Mock payment data
  const [paymentData] = useState({
    totalRevenue: 120000,
    totalTransactions: 450,
    successfulPayments: 400,
    failedPayments: 50,
  });

  const paymentChartData = [
    { name: "Success", value: paymentData.successfulPayments, fill: "#10B981" },
    { name: "Failed", value: paymentData.failedPayments, fill: "#EF4444" },
  ];

  useEffect(() => {
    // Fetch real payment details from backend (mocked for now)
    // fetch("/api/admin/payment-details").then((res) => res.json()).then(setPaymentData);
  }, []);

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">₹{paymentData.totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold">Total Transactions</h3>
          <p className="text-2xl font-bold text-blue-600">{paymentData.totalTransactions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold">Successful Payments</h3>
          <p className="text-2xl font-bold text-green-500">{paymentData.successfulPayments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold">Failed Payments</h3>
          <p className="text-2xl font-bold text-red-500">{paymentData.failedPayments}</p>
        </div>
      </section>

      {/* Payment Chart */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700">Payment Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paymentChartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </main>
  );
};

export default AdminDashboard;
