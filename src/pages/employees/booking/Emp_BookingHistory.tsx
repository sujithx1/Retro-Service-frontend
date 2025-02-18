import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { employee_get_reqServices } from "../../../reducers/employees/EmployeeApicalls";
import { AppDispatch, RootState } from "../../../store/store";
import Emp_Sidebar from "../../../components/employee/sidebar/Emp_Sidebar";
import Emp_Header from "../../../components/employee/header/Emp_Header";
import Emp_BookingDetail from "./Emp_BookingDetails";
import { Response_Req_service_employee_types } from "../../../types/clients/UsersTypes";

const Emp_BookingHistory: React.FC = () => {
  const [historyBookings, setHistoryBookings] = useState<Response_Req_service_employee_types[]>([]);
  const { employee, reqService_booking } = useSelector((state: RootState) => state.employee);
  const dispatch: AppDispatch = useDispatch();
  const [bookingId, setBookingId] = useState<string>("");
  const [detailBookingModal, setDetailBookingModal] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  useEffect(() => {
    if (Array.isArray(reqService_booking)) {
      const history = reqService_booking.filter(
        (booking) => booking.status !== "PENDING" && booking.status !== "REJECTED" && booking.acceptEmployee !== null
      );
      setHistoryBookings(history);
    }
  }, [reqService_booking]);

  useEffect(() => {
    if (employee?.id) {
      dispatch(employee_get_reqServices(employee.id));
    }
  }, [employee?.id, dispatch]);

  // Status color function
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600";
      case "COMPLETED":
        return "text-blue-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  // Pagination Logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = historyBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  return (
    <div className="flex h-screen bg-gray-100">
      <Emp_Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Emp_Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Booking History</h2>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {historyBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Problem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accept Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {[...currentBookings] // Create a copy to avoid mutating state
  .sort((a, b) => new Date(b.acceptEmployee.acceptTime || "").getTime() - new Date(a.acceptEmployee.acceptTime || "").getTime()) // Sort by date (newest first)
  .map((booking) => (
    <tr key={booking.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.userName}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{booking.problem}</td>
      <td className={`px-6 py-4 text-sm font-semibold ${getStatusColor(booking.status)}`}>{booking.status}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{new Date(booking.acceptEmployee.acceptTime || "").toLocaleString()}</td>
      <td className="px-6 py-4 text-sm">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => {
            setBookingId(booking.id);
            setDetailBookingModal(true);
          }}
        >
          View Details
        </button>
      </td>
    </tr>
  ))}

                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic p-6 text-center">No booking history available.</p>
            )}
          </div>

          {/* Pagination */}
          {historyBookings.length > bookingsPerPage && (
            <div className="flex justify-center items-center space-x-4 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600">Page {currentPage} of {Math.ceil(historyBookings.length / bookingsPerPage)}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(historyBookings.length / bookingsPerPage)))}
                disabled={currentPage === Math.ceil(historyBookings.length / bookingsPerPage)}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal for Booking Details */}
      {detailBookingModal && (
        <Emp_BookingDetail bookingId={bookingId} onClose={() => setDetailBookingModal(false)} />
      )}
    </div>
  );
};

export default Emp_BookingHistory;
