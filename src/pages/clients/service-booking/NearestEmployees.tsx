import { useNavigate, useSearchParams } from "react-router-dom";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { EmployeeStateTypes } from "../../../types/employee/EmployeeTypes";
import { User_get_findNearestEmployees, User_get_reqService, User_put_cancelReq_service, User_put_sendOneEmpoloyee } from "../../../reducers/users/UserapiCalls";
import { Cords, SendReqService_employee_types, Service_Booking_Put_status_type } from "../../../types/clients/UsersTypes";
import { toast } from "react-toastify";
import socket from "../../../socket/socket";
import UserHeader from "../../../components/client/header/Header";
import ConfirmBookingModal from "./ConfirmBooking";
import LocationDistanceTracker from "../../../components/employee/mechmap/MechTrackingMap";

 
// Function to calculate distance using the Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
  const R = 6371; // Radius of the Earth in kilometers
  const toRad = (degree: number) => degree * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2) + " km"; 
};

const NearestEmployees = () => {
  const [searchParams] = useSearchParams();
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const service = searchParams.get("service");
  const dispatch: AppDispatch = useDispatch();
  const [employees, setEmployees] = useState<EmployeeStateTypes[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeStateTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeStateTypes | null>(null);

  // Timer states per employee
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  const [dutyFilter, setDutyFilter] = useState<string>("all"); // Filter by duty status
  const [distanceFilter, setDistanceFilter] = useState<number>(10); // Default to 10 km
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const navigate=useNavigate()

  useEffect(() => {
    const savedTimers = JSON.parse(localStorage.getItem("employeeTimers") || "{}");
  
    if (!service) {
      // ✅ If there's no active service, clear previous timers
      setTimers({});
      localStorage.removeItem("employeeTimers");
    } else {
      setTimers(savedTimers);
    }
  }, [service]);
  
  useEffect(() => {
    if (!service) return;
  
    const fetchStatus = () => {
      dispatch(User_get_reqService(service))
        .unwrap()
        .then((res) => {
          console.log("Service status:", res.status);
  
          if (res.status === "ACCEPTED") {
            setConfirmModal(true);
            
            // ✅ Clear previous timers when a booking is confirmed
            setTimers({});
            localStorage.removeItem("employeeTimers"); // Clear stored timers
          } else if (res.status === "CANCELLED") {
            setTimers({});
            localStorage.removeItem("employeeTimers"); 
            navigate("/unavailable");
          }
        })
        .catch((err) => console.error("Error fetching service request:", err));
    };
  
    fetchStatus(); // Initial fetch
    const interval = setInterval(fetchStatus, 5000); // ✅ Check every 5 sec
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [dispatch, service, navigate]);
  

  useEffect(() => {
    if (!lat || !lng) return;
    const data: Cords = { lat, lng };
    setLoading(true);

    dispatch(User_get_findNearestEmployees(data))
      .unwrap()
      .then((res) => {
        setEmployees(res || []);
        setFilteredEmployees(res || []);
      })
      .catch((err) => {
        toast.error("Failed to fetch employees: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    // Load timers from local storage on mount
    const savedTimers = JSON.parse(localStorage.getItem("employeeTimers") || "{}");
    setTimers(savedTimers);
  }, [dispatch, lat, lng]);

  // Apply filters based on duty status and distance
  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const distance = calculateDistance(lat, lng, employee.location?.lat || 0, employee.location?.lng || 0);
      const isWithinDistance = parseFloat(distance) <= distanceFilter;

      const matchesDutyStatus =
        dutyFilter === "all" || (dutyFilter === "on" && employee.onDuty) || (dutyFilter === "off" && !employee.onDuty);

      return isWithinDistance && matchesDutyStatus;
    });

    setFilteredEmployees(filtered);
  }, [dutyFilter, distanceFilter, employees, lat, lng]);

  // Timer functionality to update per employee
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };
        let changed = false;

        Object.keys(updatedTimers).forEach((empId) => {
          if (updatedTimers[empId] > 0) {
            updatedTimers[empId] -= 1;
            changed = true;
          } else {
            delete updatedTimers[empId]; // Remove expired timers
            changed = true;
          }
        });

        if (changed) {
          localStorage.setItem("employeeTimers", JSON.stringify(updatedTimers));
        }

        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMapDistance = (employee: EmployeeStateTypes) => {
    setSelectedEmployee(employee);
    setShowMap(true);
  };

  const handleSendRequest = (empId: string) => {
    if (timers[empId]) return; // Prevent sending request if timer is active

    const data: SendReqService_employee_types= {
      emplId: empId,
      serviceId: service as string,
    };

    dispatch(User_put_sendOneEmpoloyee(data))
      .unwrap()
      .then((res) => {
        toast.success(`Request sent`);
        socket.emit("newBooking", res.mechanics); // Notify all users



        // Set 1-minute timer for this employee
        setTimers((prev) => {
          const updatedTimers = { ...prev, [empId]: 60 };
          localStorage.setItem("employeeTimers", JSON.stringify(updatedTimers));
          return updatedTimers;
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };
  
  
    const handleCancelBooking=()=>{
      const data:Service_Booking_Put_status_type={
        id:service||"",
        status:'CANCELLED'
      }
      dispatch(User_put_cancelReq_service(data)).unwrap()
      .then((result) => {
        console.log(result);
        toast.success("Booking Cancelled")
        // ✅ Clear timers when canceling a booking
      setTimers({});
      localStorage.removeItem("employeeTimers"); 
        navigate('/home')
        
      }).catch((err) => {
        toast.error("Booking Not Cancelled",err)
        
      });
    }
  

  return (
    <>
      <UserHeader/>
      {confirmModal && <ConfirmBookingModal bookingId={service||""} isOpen={confirmModal} onClose={() => setConfirmModal(false)} />}

      <div className="max-w-6xl mx-auto p-6">
        {showMap && selectedEmployee?.location && (
          <LocationDistanceTracker
            onClose={() => setShowMap(false)}
            userLat={lat}
            userLng={lng}
            empLat={selectedEmployee.location.lat}
            empLng={selectedEmployee.location.lng}
          />
        )}

        <h2 className="text-2xl font-bold mb-4">Nearest Employees</h2>

        {/* Filter Section */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Duty Filter */}
            <select
              value={dutyFilter}
              onChange={(e) => setDutyFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Duty Status</option>
              <option value="on">On Duty</option>
              <option value="off">Offline</option>
            </select>

            {/* Distance Filter */}
            <label htmlFor="distanceFilter" className="text-gray-600">
              Max Distance: {distanceFilter} km
            </label>
            <input
              type="range"
              id="distanceFilter"
              min="1"
              max="50"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(Number(e.target.value))}
              className="w-40"
            />
          </div>
          <button
    onClick={handleCancelBooking} // Assuming you have a handler function
    className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-150"
  >
    Cancel Booking
  </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center">Loading employees...</p>
        ) : filteredEmployees.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Distance</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                  <th className="px-6 py-3">Timer</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t">
                    <td className="px-6 py-4 text-lg">{employee.username}</td>
                    <td className="px-6 py-4">
                      {employee.location?.address?.suburb || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      {calculateDistance(lat, lng, employee.location?.lat || 0, employee.location?.lng || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          employee.onDuty ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {employee.onDuty ? "On Duty" : "Offline"}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        onClick={() => handleMapDistance(employee)}
                      >
                        Show Route
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg transition ${
                          timers[employee.id]
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                        onClick={() => handleSendRequest(employee.id)}
                        disabled={!!timers[employee.id]}
                      >
                        {timers[employee.id] ? "Waiting..." : "Send Request"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {timers[employee.id] ? `${timers[employee.id]}s` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No employees found nearby.</p>
        )}
      </div>
    </>
  );
};

export default NearestEmployees;
