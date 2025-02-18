import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { User_get_bookingHistories } from "../../../reducers/users/UserapiCalls";
import { CheckCircleIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import UserHeader from "../header/Header";
import { useNavigate } from "react-router-dom";
import socket from "../../../socket/socket";
import { toast } from "react-toastify";
import ToastAlert from "../../alert/ToastAlert";
import ReportEmployee from "../review/Report";
import { FlagIcon } from "lucide-react";

interface ReportEmpTypes {
  employeeId: string;
  userId: string;
  paymentId?: string; // Required for refunds
  amount?: number; // Required for refunds
  bookingId:string
  
}

const UserBookingHistory: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { user, bookingHistories } = useSelector((state: RootState) => state.user);
  // Pagination State
  const [reportemp,setreportemp]=useState<ReportEmpTypes>()
  const [showreport,setShowReport]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items per page

  useEffect(() => {
    if (user?.id) {
      dispatch(User_get_bookingHistories(user.id));
    }
  }, [user, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  

  // Pagination Logic
  const totalPages = Math.ceil(bookingHistories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookingHistories.slice(indexOfFirstItem, indexOfLastItem);
const [showMsg,setShowMsg]=useState(false)
  return (
    <>
      <UserHeader />
    
      {/* <div className="flex flex-col h-screen bg-gray-100 p-6"> */}
      {showreport && reportemp && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      {/* Close "X" button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        onClick={() => setShowReport(false)}
      >
        &times;
      </button>

      {/* ReportEmployee component */}
      <ReportEmployee {...reportemp} />
    </div>
  </div>
)}
      {showMsg && <ToastAlert message="Message sent successfully!" type="success" onClose={() => setShowMsg(false)} />}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Booking History</h2>
        {/* {showMsg && <SuccessAlert message="Message sent successfully!" onClose={() => setShowMsg(false)} />} */}
      
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
         
          {bookingHistories.length > 0 ? (
            <>
              {/* Table with Horizontal Scroll on Small Screens */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 sticky top-0">
                      <th className="p-4 text-left">Service</th>
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4 text-left">Location</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-t hover:bg-gray-50 transition-all cursor-pointer"
                        onClick={() => navigate(`/booking-history/details?bookingId=${booking.id}`)}
                      >
                        <td className="p-4">{booking.problem}</td>
                        <td className="p-4">{new Date(booking.bookingDate || "").toLocaleString()}</td>
                        <td className="p-4">{booking.userLocation?.address || "N/A"}</td>
                        <td className={`p-4 font-semibold ${getStatusColor(booking.status || "")}`}>
                          {booking.status}
                        </td>
                        <td className="p-4 flex flex-wrap items-center justify-center gap-3">
                          {booking.status === "CONFIRMED" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/payment?bookingId=${booking.id}`);
                              }}
                              className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                              <CheckCircleIcon className="w-5 h-5 mr-1" /> Full Payment
                            </button>
                          )}
                           {booking.status === "CONFIRMED" && (
                        <button
                        onClick={(e) => {
                          e.stopPropagation();
                      
                          const chatData = {
                            sender: user?.id || "",
                            receiver: booking.acceptEmployee?.employeeId?.toString() || "",
                            message: "Hi", // Default message
                            timestamp: new Date().toISOString(),
                            userType: "employee", // Assuming it's from the user
                          };
                      
                          // Emit message using socket (Replace with your socket instance)
                          if (socket) {
                            socket.emit("sendMessage", chatData);
                            // toast.success("Message sent successfully!"); // ✅ Show success toast
                            setShowMsg(true)
                          } else {
                            console.error("Socket is not connected.");
                            toast.error("Failed to send message.");

                          }
                      
                          // ✅ Do not open the modal
                        }}
                        className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        <ChatBubbleLeftIcon className="w-5 h-5 mr-1" /> Say Hi
                      </button>
                    
                      
                             )}
                            {(booking.status === "CONFIRMED" || booking.status === "COMPLETED") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); 
                            setreportemp({
                              userId: booking.userId,
                              employeeId: booking.acceptEmployee.employeeId,

                              amount: booking.status==="COMPLETED"?booking.minWage:100,
                              paymentId: booking.paymentId,
                              bookingId:booking.id
                            });
                            setShowReport(true);
                          }}
                          className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          <FlagIcon className="w-5 h-5 mr-1" /> Report
                        </button>
                      )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center p-4 border-t bg-gray-100">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg mx-2 transition ${
                    currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>

                <span className="text-gray-700 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg mx-2 transition ${
                    currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic p-6 text-center">No booking history available.</p>
          )}
        </div>
      {/* </div> */}
    </>
  );
};

export default UserBookingHistory;
