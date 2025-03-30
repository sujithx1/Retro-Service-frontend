import { useEffect, useState } from "react";
import { EmployeeStateTypes, WalletResponse } from "../../../types/employee/EmployeeTypes";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { Admin_get_Employees, admin_getalltransaction, admin_getwallet, AdminHandleApprove_mechaninc } from "../../../reducers/admin/adminapicalls";
import EmployeeCard from "../../../pages/admin/workers/EmployeeCard";
import { TransactonsTypes } from "../../../types/clients/UsersTypes";
import TransactionsChart from "./Transactions";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState<EmployeeStateTypes[]>([])
const dispatch:AppDispatch=useDispatch()

const [alltransactions,setAllTransactions]=useState<TransactonsTypes[]|[]>([])
const [adminWallet,setadminWallet]=useState<WalletResponse|null>(null)



const totalRevenue = alltransactions
  ?.filter((txn) => ["purchase", "deposit", "advancepay", "credited", "payment"].includes(txn.type))
  .reduce((acc, txn) => acc + txn.amount, 0) || 0;

const totalExpenses = alltransactions
  ?.filter((txn) => ["refund", "withdrawal"].includes(txn.type))
  .reduce((acc, txn) => acc + txn.amount, 0) || 0;

const profit = totalRevenue - totalExpenses;

const totalFailedtransactionCount = alltransactions
  ?.filter((txn) => ["refund", "withdrawal"].includes(txn.type))
  .length

  const handleApprove = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));

    dispatch(AdminHandleApprove_mechaninc(id))
  };


  useEffect(()=>{
    dispatch(Admin_get_Employees()).unwrap()
    .then((res)=>{
    
      setEmployees(res.filter((item) => !item.isValidated))

    })

  },[dispatch])
  // Mock payment data
 

 

  useEffect(() => {
    // Fetch real payment details from backend (mocked for now)

    dispatch(admin_getwallet())
    .unwrap()
    .then((res)=>setadminWallet(res))

    dispatch(admin_getalltransaction())
    .unwrap()
    .then((res)=>setAllTransactions(res))

    // fetch("/api/admin/payment-details").then((res) => res.json()).then(setPaymentData);
  }, [dispatch]);

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Total Revenue */}
  <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40 text-center">
    <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
    <p className="text-3xl font-extrabold text-green-600">₹{profit}
    </p>
  </div>

  {/* Total Transactions */}
  <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40 text-center">
    <h3 className="text-lg font-semibold text-gray-800">Total Transactions</h3>
    <p className="text-3xl font-extrabold text-blue-600">{alltransactions.length}</p>
  </div>

  {/* Successful Payments */}
  <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40 text-center">
    <h3 className="text-lg font-semibold text-gray-800">Successful Payments</h3>
    <p className="text-3xl font-extrabold text-green-500">{alltransactions.length-totalFailedtransactionCount}</p>
  </div>

  {/* Failed Payments */}
  <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40 text-center">
    <h3 className="text-lg font-semibold text-gray-800">Failed Payments</h3>
    <p className="text-3xl font-extrabold text-red-500">{totalFailedtransactionCount}</p>
  </div>

  {/* Total Profit */}
  <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40 text-center col-span-1 sm:col-span-2">
    <h3 className="text-lg font-semibold text-gray-800">Total Profit</h3>
    <p className="text-3xl font-extrabold text-purple-600">₹{adminWallet?.balance}</p>
  </div>

  {/* Expenses */}
  {/* <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40 text-center">
    <h3 className="text-lg font-semibold text-gray-800">Total Expenses</h3>
    <p className="text-3xl font-extrabold text-yellow-600">₹{paymentData.expenses}</p>
  </div> */}

  {/* Profit Margin */}
  {/* <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/40 text-center">
    <h3 className="text-lg font-semibold text-gray-800">Profit Margin</h3>
    <p className="text-3xl font-extrabold text-teal-500">
      {((paymentData.totalRevenue - paymentData.expenses) / paymentData.totalRevenue * 100).toFixed(2)}%
    </p>
  </div> */}
</section>


      {/* Payment Chart */}
      {/* <section className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700">Payment Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paymentChartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </section> */}

<TransactionsChart alltransactions={alltransactions}/>

      <h1 className="text-2xl font-bold">Employee Verification</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} onApprove={handleApprove} />
        ))}
      </div>
    </main>
  );
};

export default AdminDashboard;
