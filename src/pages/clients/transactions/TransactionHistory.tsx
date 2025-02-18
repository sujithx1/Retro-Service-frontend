import { useEffect, useState } from "react";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { TransactonsTypes } from "../../../types/clients/UsersTypes";
import { user_get_Transactionhistory } from "../../../reducers/users/UserapiCalls";
import { Employee_get_Transactionhistory } from "../../../reducers/employees/EmployeeApicalls";
import { Admin_get_Transactionhistory } from "../../../reducers/admin/adminapicalls";
import { CreditCard, ArrowDown, ArrowUp, RefreshCcw, Banknote, Wallet2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import UserHeader from "../../../components/client/header/Header"; 
import Emp_Header from "../../../components/employee/header/Emp_Header";
import Emp_Sidebar from "../../../components/employee/sidebar/Emp_Sidebar";

const TransactionHistory = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");
  const dispatch: AppDispatch = useDispatch();
  const [transactions, setTransactions] = useState<TransactonsTypes[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  console.log(transactions);
 transactions?.slice().sort((a,b)=>new Date(b.createdAt||"").getTime()-new Date(a.createdAt||"").getTime()).map((item)=> console.log(item))
  
  
  
  useEffect(() => {
    const fetchTransactions = async () => {
        if(!userId)return null
      let res;
      if (type === "user") {
        res = await dispatch(user_get_Transactionhistory(userId)).unwrap();
      } else if (type === "employee" ) {
        res = await dispatch(Employee_get_Transactionhistory(userId)).unwrap();
      } else {
        res = await dispatch(Admin_get_Transactionhistory(userId)).unwrap();
      }
      setTransactions(res);
    };
    fetchTransactions();
  }, [dispatch, type, userId]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case "refund":
        return <RefreshCcw className="w-5 h-5 text-green-500" />;
      case "deposit":
        return <ArrowDown className="w-5 h-5 text-green-500" />;
      case "withdrawal":
        return <ArrowUp className="w-5 h-5 text-red-500" />;
      case "credited":
        return <ArrowUp className="w-5 h-5 text-green-500" />;
      case "advancepay":
        return <Banknote className="w-5 h-5 text-purple-500" />;
      default:
        return <Wallet2 className="w-5 h-5 text-gray-500" />;
    }
  };

  const totalPages = Math.ceil((transactions?.length || 0) / itemsPerPage);
  const sortedTransactions = transactions
  ?.slice()
  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

const paginatedTransactions = sortedTransactions?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      {type === "employee" ? (
        <div className="flex">
            <Emp_Sidebar />
            <div className="flex-1">
          <Emp_Header />
              <TransactionTable transactions={paginatedTransactions??[]} getTransactionIcon={getTransactionIcon} />
              <PaginationControls currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        
      ) : (
        <>
          <UserHeader/>
          <TransactionTable transactions={paginatedTransactions??[]} getTransactionIcon={getTransactionIcon} />
          <PaginationControls currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </>
      )}
    </>
  );
};


const TransactionTable = ({ transactions, getTransactionIcon }: { transactions: TransactonsTypes[] | null, getTransactionIcon: (type: string) => JSX.Element }) => {
    // Ensure transactions exist and sort them by `createdAt` in descending order (latest first)
    const sortedTransactions = transactions?.slice().sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    ) ?? [];
  
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Payment</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-100 transition-all">
                  <td className="p-4 flex items-center gap-2">
                    {getTransactionIcon(item.type)}
                    <span className="capitalize">{item.type}</span>
                  </td>
                  <td className="p-4 font-semibold">
                    {item.type === "credited" || item.type === "refund" ? (
                      <span className="text-green-600">+₹{item.amount.toFixed(2)}</span>
                    ) : (
                      <span className="text-red-600">-₹{item.amount.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="p-4 capitalize">{item.paymentMethod}</td>
                  <td className="p-4">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }: { currentPage: number; totalPages: number; setCurrentPage: (page: number) => void }) => (
    <div className="flex justify-between items-center mt-4 max-w-4xl mx-auto p-4">
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

export default TransactionHistory;
