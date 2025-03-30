import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../../store/store";
import { Response_Req_service_employee_types } from "../../../types/clients/UsersTypes";
import { admin_getServiceBookingDetails } from "../../../reducers/admin/adminapicalls";
import AdminHeader from "../../../components/admin/header/AdminHeader";
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import { ArrowLeft } from "lucide-react";

const BookingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Response_Req_service_employee_types | null>(null);

  useEffect(() => {
    dispatch(admin_getServiceBookingDetails(id || ""))
      .unwrap()
      .then((res) => setBooking(res))
      .catch((err) => console.log(err));
  }, [dispatch, id]);

  return (
    <>
      <AdminHeader />
      <div className="flex min-h-screen bg-gradient-to-r from-white to-blue-50">
        <AdminSidebar />

        <div className="flex-1 p-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-800 hover:text-blue-500 bg-white/60 backdrop-blur-md shadow-lg px-5 py-2 rounded-xl border border-white/40 transition duration-200"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="text-lg font-semibold">Back</span>
          </button>

          {/* Page Title */}
          <h2 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-wide">Booking Details</h2>

          {booking ? (
            <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <p className="text-gray-800">
                    <strong className="text-gray-900">User:</strong> {booking.userName} ({booking.userEmail})
                  </p>
                  <p className="text-gray-800">
                    <strong className="text-gray-900">Location:</strong> {booking.userLocation.address}
                  </p>
                  <p className="text-gray-800">
                    <strong className="text-gray-900">Problem:</strong> {booking.problem}
                  </p>
                  <p className="text-gray-800">
                    <strong className="text-gray-900">Job:</strong> {booking.jobName} (ID: {booking.jobId})
                  </p>
                  <p className="text-gray-800">
                    <strong className="text-gray-900">Min Wage:</strong> ₹{booking.minWage}
                  </p>
                </div>

                {/* Right Column */}
                <div>
                  <p className="text-gray-800">
                    <strong className="text-gray-900">Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()}
                  </p>
                  <p className="text-gray-800">
                    <strong className="text-gray-900">Status:</strong> 
                    <span className={`px-2 py-1 ml-2 rounded-lg text-sm font-medium ${
                      booking.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {booking.status}
                    </span>
                  </p>
                  {booking.paymentId && (
                    <p className="text-gray-800">
                      <strong className="text-gray-900">Payment ID:</strong> {booking.paymentId}
                    </p>
                  )}
                  {booking.acceptEmployee && booking.acceptEmployee.employeeId && (
                    <p className="text-gray-800">
                      <strong className="text-gray-900">Accepted By Employee:</strong> {booking.acceptEmployee.employeeId} at{" "}
                      {booking.acceptEmployee.acceptTime
                        ? new Date(booking.acceptEmployee.acceptTime).toLocaleString()
                        : "Not Accepted Yet"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-lg">Loading booking details...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingDetailsPage;
