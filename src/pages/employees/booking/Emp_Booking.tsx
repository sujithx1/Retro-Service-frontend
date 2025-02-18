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
import socket from "../../../socket/socket";



const UnconfirmedBookings: React.FC = () => {
  const { employee, reqService_booking } = useSelector(
    (state: RootState) => state.employee
  );
  console.log(reqService_booking);
  
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

  // // useEffect(() => {
  // //   // Listen for new booking notifications
  // //   socket.on("bookingNotification", (booking: { employeeId?: string; serviceName?: string }[] | null) => {
  // //     if (!Array.isArray(booking)) return; // Ensure booking is an array
  // //     if (!employee?.id) {
  // //       console.warn("Employee ID is not available, skipping notification check.");
  // //       return; // Exit early if employee ID is missing
  // //     }
  // //     const validBookings = booking.filter((emp) => emp && emp.employeeId);
  // //     console.log(validBookings);
      

  // //     const matchedBooking = validBookings.find((emp) => emp?.employeeId === employee?.id);
    
  // //     if (matchedBooking) {
  // //       console.log("Received New Booking:", matchedBooking);
  // //       alert(`New Booking: ${matchedBooking.serviceName || "Unknown Service"}`);
  // //     }
  // //   });
    

  //   return () => {
  //     socket.off("bookingNotification"); // Cleanup listener on unmount
  //   };
  // }, [employee?.id]);
  // Fetch bookings based on employee on duty
  const fetchBookings = useCallback(async () => {
    if (employee?.id && employee.onDuty) {
      try {
        await dispatch(employee_get_reqServices(employee.id)).unwrap();
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    }
  }, [dispatch, employee]);

  useEffect(() => {

    // Fetch the bookings when the component mounts or when the employee or onDuty state changes
    fetchBookings();
    const intervalId = setInterval(fetchBookings, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval when component unmounts
  }, [fetchBookings]);

  // Filter pending bookings
  useEffect(() => {
    if (Array.isArray(reqService_booking)) {
      const pending = reqService_booking.filter((booking) => booking.status === "PENDING");
      setPendingBookings(pending); // Update the pendingBookings state
    }
  }, [reqService_booking]); // Only update pendingBookings when reqService_booking changes

  const handleConfirm = async (id: string) => {
    if (pendingBookings && employee) {
      const service: req_service_accept_types = {
        id,
        status: "ACCEPTED",
        employeeId: employee.id,
      };

      try {
        await dispatch(employee_put_accept_service(service)).unwrap();
        toast.success("Booking confirmed successfully");
        socket.emit('confirmBooking',service.id)
        fetchBookings(); // Fetch updated data after confirmation
      } catch (err) {
        toast.error((err as Error).message || "Error confirming booking");
      }
    }
  };

  // Check if employee is on duty
  if (!employee?.onDuty) {
    return (
      <div className="flex">
        <Emp_Sidebar />
        <div className="flex flex-col w-full">
          <Emp_Header />
          <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-red-600">You're Currently Offline!</h2>
              <p className="text-gray-600 mt-2">Please activate "On Duty" mode to receive pending tasks.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              empLat={employee.location?.lat || 0}
              empLng={employee.location?.lng || 0}
              
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
          {pendingBookings.length > 0 ? (
            viewMode === "cards" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="bg-white shadow-xl rounded-lg p-6">
                    <h3 className="text-xl font-medium">{booking.userName}</h3>
                    <p>{booking.problem}</p>
                    <p>  {new Date(
    booking.mechanics.find((emp) => emp.employeeId?.toString() == employee?.id)
      ?.bookingDate ?? booking.bookingDate
  ).toLocaleString()}  </p>      
      <p>{booking.userLocation.address}</p>
                    <button
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
                      aria-label="Open location map"
                      onClick={() => {
                        setLoactionTrackModal(true);
                        setUserlocation(booking.userLocation);
                      }}
                    >
                      Map
                    </button>

                    <div className="mt-5 flex justify-between">
                      <button
                        className={`bg-green-500 text-white px-4 py-2 rounded-lg`}
                       
                        onClick={() => handleConfirm(booking.id)}
                      >
                       
                          Confirm
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No pending bookings available.</p>
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
