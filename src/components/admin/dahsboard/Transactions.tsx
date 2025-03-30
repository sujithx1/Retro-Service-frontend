import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface TransactonsTypes {
  id: string;
  userId: string;
  type: "purchase" | "refund" | "deposit" | "withdrawal" | "advancepay" | "payment" | "credited";
  amount: number;
  status: "complete" | "pending" | "failed";
  paymentMethod: "razorypay" | "wallet" | "cod";
  serviceType: "service" | "product";
  createdAt?: Date;
}

const TransactionsChart = ({ alltransactions }: { alltransactions: TransactonsTypes[] }) => {
  const [chartData, setChartData] = useState<{ date: string; success: number; failed: number }[]>([]);

  useEffect(() => {
    const groupedData: Record<string, { success: number; failed: number }> = {};

    alltransactions.forEach((txn) => {
      const date = new Date(txn.createdAt || "").toLocaleDateString(); // Group by date

      if (!groupedData[date]) {
        groupedData[date] = { success: 0, failed: 0 };
      }

      if (["purchase", "deposit", "advancepay", "credited", "payment"].includes(txn.type) && txn.status === "complete") {
        groupedData[date].success += txn.amount;
      } else if (["refund", "withdrawal"].includes(txn.type) && txn.status === "complete") {
        groupedData[date].failed += txn.amount;
      }
    });

    const formattedData = Object.keys(groupedData).map((date) => ({
      date,
      success: groupedData[date].success,
      failed: groupedData[date].failed,
    }));

    setChartData(formattedData);
  }, [alltransactions]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Status Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="success" fill="#4CAF50" name="Payment Success" />
          <Bar dataKey="failed" fill="#FF5733" name="Payment Failed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionsChart;
