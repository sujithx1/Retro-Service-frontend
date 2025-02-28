import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { Admin_Get_FeedBack, Admin_put_FeedBackRefund } from "../../../reducers/admin/adminapicalls";
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import AdminHeader from "../../../components/admin/header/AdminHeader";
import ToastAlert from "../../../components/alert/ToastAlert";
import { ToastMsg } from "../../../types/admin/admintypes";

const AdminReportFeedbackList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { feedbacks } = useSelector((state: RootState) => state.admin);
  console.log(feedbacks);
  
  const[showmsg,setShowmsg]=useState<ToastMsg>({
    action:false,
    message:"",
    type:"idle"
  })

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set how many items per page

  useEffect(() => {
    dispatch(Admin_Get_FeedBack())
    
  
  }, [dispatch]);

  // Sort feedbacks by date (newest first)
  const sortedFeedbacks = [...feedbacks].sort(
    (a, b) =>
      new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
  );

  // Pagination Logic
  const totalPages = Math.ceil(sortedFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = sortedFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Refund Action
  const handleRefund = (feedbackId: string, amount: number) => {
    // Implement refund logic here

    
    console.log(`Refunding ${amount} for feedback ID: ${feedbackId}`);
    // alert(`Refund of $${amount} processed for feedback ID: ${feedbackId}`);

     dispatch(Admin_put_FeedBackRefund(feedbackId)).unwrap()
     .then(()=>setShowmsg({
      action:true,
      message:'Success Refund',
      type:"success"
     }))
  };

  return (
    <>
    {showmsg.action && <ToastAlert onClose={()=>setShowmsg((prev)=>({...prev,action:false}))} message={showmsg.message} type={showmsg.type as "info"|"success"|"error"} />}
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">User Feedback Reports</h1>

          {/* Table Container */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] table-auto">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {/* <th className="px-4 py-3 text-left">User Name</th> */}
                    <th className="px-2 py-3 text-left">User Email</th>
                    <th className="px-2 py-3 text-left">Feedback</th>
                    <th className="px-2 py-3 text-left">Employee Email</th>
                    <th className="px-2 py-3 text-left">Rating</th>
                    <th className="px-2 py-3 text-left">Type</th>
                    <th className="px-2 py-3 text-left">Amount</th>
                    <th className="px-2 py-3 text-left">Created At</th>
                    <th className="px-2 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFeedbacks.map((feedback) => (
                    <tr
                      key={feedback.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                      {/* <td className="px-4 py-3 text-gray-700">{feedback.name}</td> */}
                      <td className="px-4 py-3 text-gray-700">{feedback.userEmail}</td>
                      <td className="px-4 py-3 text-gray-700">{feedback.feedBack}</td>
                      <td className="px-4 py-3 text-gray-700">{feedback.employeeEmail}</td>
                      <td className="px-4 py-3 text-gray-700">{feedback.rating}</td>
                      <td className="px-4 py-3 text-gray-700">{feedback.type}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {feedback.type === "report" && feedback.amount ? `₹${feedback.amount}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(feedback.createdAt || "").toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
  {feedback.type === "report" && feedback.amount && feedback.refaund === false && (
    <button
      onClick={() => handleRefund(feedback.id || "", feedback.amount || 0)}
      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
    >
      Refund
    </button>
  )}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
              </>
  );
};

export default AdminReportFeedbackList;