import React, { useEffect, useState, useCallback } from "react";
import Emp_Header from "../../../components/employee/header/Emp_Header";
import Emp_Sidebar from "../../../components/employee/sidebar/Emp_Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import {
  employee_get_reqServices,
  employee_put_accept_service,
} from "../../../reducers/employees/EmployeeApicalls";
import {
  FinduserLocation,
  req_service_accept_types,
  Response_Req_service_employee_types,
} from "../../../types/clients/UsersTypes";
import { toast } from "react-toastify";
import LocationDistanceTracker from "../../../components/employee/mechmap/MechTrackingMap";

const UnconfirmedBookings: React.FC = () => {
  const { employee, reqService_booking } = useSelector(
    (state: RootState) => state.employee
  );
  const dispatch: AppDispatch = useDispatch();

  const [pendingBookings, setPendingBookings] = useState<
    Response_Req_service_employee_types[]
  >([]);

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [locationTrackModal, setLoactionTrackModal] = useState(false);
  const [userLocation, setUserlocation] = useState<FinduserLocation>({
    lat: 0,
    lng: 0,
    address: "",
  });
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
      const pending = reqService_booking.filter(
        (booking) => booking.status === "PENDING"
      );
   
      setPendingBookings(pending);
    }
  }, [reqService_booking]);

  const handleConfirm = async (id: string) => {
    if (pendingBookings && employee) {
      const service: req_service_accept_types = {
        id,
        status: "CONFIRMED",
        employeeId: employee.id,
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
          {locationTrackModal && (
            <LocationDistanceTracker
              userLat={userLocation.lat}
              userLng={userLocation.lng}
              onClose={() => setLoactionTrackModal(false)}
            />
          )}
          <div className="flex justify-end mb-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                viewMode === "cards" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setViewMode("cards")}
            >
              Cards View
            </button>
            <button
              className={`ml-2 px-4 py-2 rounded-lg ${
                viewMode === "table" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
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
                  <div
                    key={booking.id}
                    className="bg-white shadow-xl rounded-lg p-6"
                  >
                    <h3 className="text-xl font-medium">{booking.userName}</h3>
                    <p>{booking.problem}</p>
                    <p>
                      {new Date(booking.bookingDate || "").toLocaleString()}
                    </p>
                    <p>{booking.userLocation.address}</p>
                    <button
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
                      aria-label="Open location map"
                      onClick={() => {
                        setLoactionTrackModal(true);
                        setUserlocation(booking.userLocation);
                      }}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      Map
                    </button>

                    <div className="mt-5 flex justify-between">
                      <button
                        className={`${
                          booking.acceptEmployee.employeeId &&
                          booking.acceptEmployee.employeeId !== employee?.id
                            ? "bg-gray-500 text-white"
                            : "bg-green-500 text-white"
                        } px-4 py-2 rounded-lg`}
                        disabled={
                          !!booking.acceptEmployee.employeeId &&
                          booking.acceptEmployee.employeeId !== employee?.id
                        }
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
                    <tr key={booking.id}>
                      <td className="px-6 py-2">{booking.userName}</td>
                      <td className="px-6 py-2">{booking.problem}</td>
                      <td className="px-6 py-2">
                        {new Date(
                          booking.acceptEmployee.acceptTime || ""
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-2">
                        {booking.userLocation.address}
                      </td>
                      <td className="px-6 py-2">
                        <button
                          className={`${
                            booking.acceptEmployee.employeeId &&
                            booking.acceptEmployee.employeeId !== employee?.id
                              ? "bg-gray-500 text-white"
                              : "bg-green-500 text-white"
                          } px-4 py-2 rounded-lg`}
                          disabled={
                            !!booking.acceptEmployee.employeeId &&
                            booking.acceptEmployee.employeeId !== employee?.id
                          }
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

         
        </div>
      </div>
    </div>
  );
};

export default UnconfirmedBookings;
