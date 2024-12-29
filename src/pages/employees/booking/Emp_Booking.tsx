import { useEffect, useState } from "react";
import Emp_Header from "../../../components/employee/header/Emp_Header";
import Emp_Sidebar from "../../../components/employee/sidebar/Emp_Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { Employee_get_Service_Booking, employee_put_ServiceBooking } from "../../../reducers/employees/EmployeeApicalls";
import { Response_ServiceBooking_Types, Service_Booking_Put_status_type } from "../../../types/clients/UsersTypes";
import { toast } from "react-toastify";

const UnconfirmedBookings = () => {
  const { employee, employeeServiceBooking } = useSelector(
    (state: RootState) => state.employee
  );
  const dispatch: AppDispatch = useDispatch();

  const [pendingBookings, setPendingBookings] = useState<Response_ServiceBooking_Types[] | null>([]);
  const [historyBookings, setHistoryBookings] = useState<Response_ServiceBooking_Types[] | null>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  useEffect(() => {
    if (employee?.id) {
      dispatch(Employee_get_Service_Booking(employee.id));
    }
  }, [dispatch, employee]);

  useEffect(() => {
    if (Array.isArray(employeeServiceBooking)) {
      const pending = employeeServiceBooking.filter((booking) => booking.status === "PENDING");
      const history = employeeServiceBooking.filter(
        (booking) => booking.status === "CANCELLED" || booking.status === "CONFIRMED" || booking.status === "COMPLETED"
      );

      setPendingBookings(pending);
      setHistoryBookings(history);
    }
  }, [employeeServiceBooking]);

  const handleConfirm = (id: string) => {
    if (pendingBookings) {
      const service:Service_Booking_Put_status_type={
        id:id,
        status:"CONFIRMED"

      }
      dispatch(employee_put_ServiceBooking(service))
      .unwrap().then(()=>toast.success("Success "))
      .catch((err)=>toast.error(err))
      setPendingBookings(pendingBookings.filter((booking) => booking.id !== id));


    }
  };

  const handleReject = (id: string) => {
    if (pendingBookings) {
      const service:Service_Booking_Put_status_type={
        id:id,
        status:"CANCELLED"

      }
      dispatch(employee_put_ServiceBooking(service))
      .unwrap().then(()=>toast.success("Success"))
      .catch((err)=>toast.error(err))
      setPendingBookings(pendingBookings.filter((booking) => booking.id !== id));



      setPendingBookings(pendingBookings.filter((booking) => booking.id !== id));
    }
  };

  return (
    <div className="flex">
      <Emp_Sidebar />
      <div className="flex flex-col w-full">
        <Emp_Header />
        <div className="min-h-screen bg-gray-50 p-8">
          {/* View Mode Toggle Button */}
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

          {/* Pending Bookings Section */}
          <h2 className="text-2xl font-bold mb-5">Pending Bookings</h2>
          {pendingBookings && pendingBookings.length > 0 ? (
            viewMode === "cards" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="bg-white shadow-xl rounded-lg p-6">
                    <h3 className="text-xl font-medium">{booking.userName}</h3>
                    <p>{booking.problem}</p>
                    <p>{booking.bookingDate}</p>
                    <p>{booking.userLocation}</p>
                    <div className="mt-5 flex justify-between">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleConfirm(booking.id)}
                      >
                        Confirm
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleReject(booking.id)}
                      >
                        Reject
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
                    <th className="px-6 py-2 text-left">Booking Date</th>
                    <th className="px-6 py-2 text-left">Location</th>
                    <th className="px-6 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-2">{booking.userName}</td>
                      <td className="px-6 py-2">{booking.problem}</td>
                      <td className="px-6 py-2">{booking.bookingDate}</td>
                      <td className="px-6 py-2">{booking.userLocation}</td>
                      <td className="px-6 py-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleConfirm(booking.id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => handleReject(booking.id)}
                        >
                          Reject
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

          {/* Booking History Section */}
          <h2 className="text-2xl font-bold mt-10 mb-5">Booking History</h2>
          <div className="relative max-h-96 overflow-y-auto bg-gray-50 rounded-lg shadow-lg">
            {historyBookings && historyBookings.length > 0 ? (
              <div className="border-l-4 border-blue-500 p-4">
                {historyBookings
                  .slice()
                  .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
                  .map((booking) => (
                    <div
                      key={booking.id}
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
                        Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Location: {booking.userLocation}</p>
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
