import React, { useEffect, useState, useCallback } from "react";
import Emp_Header from "../../../components/employee/header/Emp_Header";
import Emp_Sidebar from "../../../components/employee/sidebar/Emp_Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { employee_get_reqServices, employee_put_accept_service } from "../../../reducers/employees/EmployeeApicalls";
import { req_service_accept_types, Response_Req_service_employee_types } from "../../../types/clients/UsersTypes";
import { toast } from "react-toastify";

const UnconfirmedBookings: React.FC = () => {
  const { employee, reqService_booking } = useSelector(
    (state: RootState) => state.employee
  );
  const dispatch: AppDispatch = useDispatch();

  const [pendingBookings, setPendingBookings] = useState<Response_Req_service_employee_types[]>([]);
  const [historyBookings, setHistoryBookings] = useState<Response_Req_service_employee_types[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const fetchBookings = useCallback(async () => {
    if (employee?.id) {
      try {
        await dispatch(employee_get_reqServices(employee.id)).unwrap();
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    }
  }, [dispatch, employee]);

  useEffect(() => {
    fetchBookings();
    const intervalId = setInterval(fetchBookings, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchBookings]);

  useEffect(() => {
    if (Array.isArray(reqService_booking)) {
      const pending = reqService_booking.filter((booking) => booking.status === "PENDING");
      const history = reqService_booking.filter(
        (booking) => booking.status !== "PENDING"
      );

      setPendingBookings(pending);
      setHistoryBookings(history);
    }
  }, [reqService_booking]);

  const handleConfirm = async (id: string) => {
    if (pendingBookings && employee) {
      const service: req_service_accept_types = {
        id,
        status: "CONFIRMED",
        employeeId: employee.id
      };

      try {
        await dispatch(employee_put_accept_service(service)).unwrap();
        toast.success("Booking confirmed successfully");
        fetchBookings(); // Fetch updated data after confirmation
      } catch (err) {
        toast.error((err as Error).message || "Error confirming booking");
      }
    }
  };

  return (
    <div className="flex">
      <Emp_Sidebar />
      <div className="flex flex-col w-full">
        <Emp_Header />
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="flex justify-end mb-4">
            <button
              className={`px-4 py-2 rounded-lg ${viewMode === "cards" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setViewMode("cards")}
            >
              Cards View
            </button>
            <button
              className={`ml-2 px-4 py-2 rounded-lg ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setViewMode("table")}
            >
              Table View
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-5">Pending Bookings</h2>
          {pendingBookings && pendingBookings.length > 0 ? (
            viewMode === "cards" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingBookings.map((booking) => (
                  <div key={booking.jobId} className="bg-white shadow-xl rounded-lg p-6">
                    <h3 className="text-xl font-medium">{booking.userName}</h3>
                    <p>{booking.problem}</p>
                    <p>{new Date(booking.bookingDate || '').toLocaleString()}</p>
                    <p>{booking.userLocation.address}</p>
                    <div className="mt-5 flex justify-between">
                      <button
                        className={`${
                          booking.acceptEmployee.employeeId && booking.acceptEmployee.employeeId !== employee?.id
                            ? "bg-gray-500 text-white"
                            : "bg-green-500 text-white"
                        } px-4 py-2 rounded-lg`}
                        disabled={!!booking.acceptEmployee.employeeId && booking.acceptEmployee.employeeId !== employee?.id}
                        onClick={() => handleConfirm(booking.id)}
                      >
                        {booking.acceptEmployee.employeeId
                          ? "Already Confirmed"
                          : "Confirm"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="table-auto w-full bg-white shadow-xl rounded-lg">
                <thead>
                  <tr>
                    <th className="px-6 py-2 text-left">User Name</th>
                    <th className="px-6 py-2 text-left">Problem</th>
                    <th className="px-6 py-2 text-left">Accept Time</th>
                    <th className="px-6 py-2 text-left">Location</th>
                    <th className="px-6 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBookings.map((booking) => (
                    <tr key={booking.jobId}>
                      <td className="px-6 py-2">{booking.userName}</td>
                      <td className="px-6 py-2">{booking.problem}</td>
                      <td className="px-6 py-2">{new Date(booking.acceptEmployee.acceptTime || '').toLocaleDateString()}</td>
                      <td className="px-6 py-2">{booking.userLocation.address}</td>
                      <td className="px-6 py-2">
                        <button
                          className={`${
                            booking.acceptEmployee.employeeId && booking.acceptEmployee.employeeId !== employee?.id
                              ? "bg-gray-500 text-white"
                              : "bg-green-500 text-white"
                          } px-4 py-2 rounded-lg`}
                          disabled={!!booking.acceptEmployee.employeeId && booking.acceptEmployee.employeeId !== employee?.id}
                          onClick={() => handleConfirm(booking.jobId)}
                        >
                          {booking.acceptEmployee.employeeId
                            ? "Already Confirmed"
                            : "Confirm"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <p>No pending bookings available.</p>
          )}

          <h2 className="text-2xl font-bold mt-10 mb-5">Booking History</h2>
          <div className="relative max-h-96 overflow-y-auto bg-gray-50 rounded-lg shadow-lg">
            {historyBookings && historyBookings.length > 0 ? (
              <div className="border-l-4 border-blue-500 p-4">
                {historyBookings
                  .slice()
                  .sort((a, b) => new Date(b.acceptEmployee.acceptTime || '').getTime() - new Date(a.acceptEmployee.acceptTime || '').getTime())
                  .map((booking) => (
                    <div
                      key={booking.jobId}
                      className="ml-6 mb-8 flex flex-col bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-blue-600">{booking.userName}</h3>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{booking.problem}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Accept Time: {new Date(booking.acceptEmployee.acceptTime || '').toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Location: {booking.userLocation.address}</p>
                      <div className="absolute -left-3 top-6 bg-blue-500 rounded-full h-6 w-6"></div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 italic p-4">No booking history available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnconfirmedBookings;

