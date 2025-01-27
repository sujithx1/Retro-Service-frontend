import type React from "react"
import { useEffect, useState } from "react"
import type { AppDispatch, RootState } from "../../../store/store"
import { useDispatch, useSelector } from "react-redux"
import { employee_get_reqServices } from "../../../reducers/employees/EmployeeApicalls"
import type { Response_Req_service_employee_types } from "../../../types/clients/UsersTypes"
import Emp_Sidebar from "../../../components/employee/sidebar/Emp_Sidebar"
import Emp_Header from "../../../components/employee/header/Emp_Header"
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Emp_BookingDetail from "./Emp_BookingDetails"


const Emp_BookingHistory: React.FC = () => {
  const [historyBookings, setHistoryBookings] = useState<Response_Req_service_employee_types[]>([])
  const { employee, reqService_booking } = useSelector((state: RootState) => state.employee)
  const dispatch: AppDispatch = useDispatch()

  const [bookingId, setBookingId] = useState<string>("")
  const [detailBookingModal, setDetailBookingModal] = useState(false)

  useEffect(() => { 
    if (Array.isArray(reqService_booking)) {
      const history = reqService_booking.filter((booking) => booking.status !== "PENDING")
      setHistoryBookings(history)
    }
  }, [reqService_booking])

  useEffect(() => {
    const fetchData = async () => {
      if (employee?.id) {
        try {
          await dispatch(employee_get_reqServices(employee.id))
        } catch (error) {
          console.error("Failed to fetch employee services:", error)
        }
      }
    }

    fetchData()
  }, [employee?.id, dispatch])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
         case "CANCELLED":
        return "bg-red-100 text-white-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Emp_Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Emp_Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Booking History</h2>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {historyBookings && historyBookings.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {historyBookings
                    .sort(
                      (a, b) =>
                        new Date(b.acceptEmployee.acceptTime || "").getTime() -
                      new Date(a.acceptEmployee.acceptTime || "").getTime(),
                    )
                    .map((booking) => (
                      <div key={booking.id} className="p-6 hover:bg-gray-50 transition-all duration-300" onClick={() => {
                        setBookingId(booking.id)
                        setDetailBookingModal(true)
                      }}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-500 rounded-full p-2">
                              <UserIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">{booking.userName}</h3>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{booking.problem}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                            <span>
                              Accept Time: {new Date(booking.acceptEmployee.acceptTime || "").toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <span>Booking Date: {new Date(booking.bookingDate || "").toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 md:col-span-2">
                            <MapPinIcon className="h-5 w-5 text-gray-400" />
                            <span>Location: {booking.userLocation.address}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 italic p-6 text-center">No booking history available.</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Booking Details */}
      {detailBookingModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Booking Details
                      </h3>
                      <button
                        onClick={() => setDetailBookingModal(false)}
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    {bookingId && (
                      <Emp_BookingDetail bookingId={bookingId} onClose={() => setDetailBookingModal(false)} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Emp_BookingHistory
