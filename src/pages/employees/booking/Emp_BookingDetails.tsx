import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../../store/store"
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  
  CreditCardIcon,
  TruckIcon,
  PhoneIcon,

} from "@heroicons/react/24/outline"
import { employee_get_payment_service } from "../../../reducers/employees/EmployeeApicalls"
import type { Response_ServiceBooking_History_types } from "../../../types/clients/UsersTypes"

interface Props {
  bookingId: string
  onClose: () => void
}

const Emp_BookingDetail: React.FC<Props> = ({ bookingId ,onClose}) => {
  const booking = useSelector((state: RootState) => state.employee.reqService_booking.find((b) => b.id === bookingId))
  const [paymentDetails, setPaymentDetails] = useState<Response_ServiceBooking_History_types | null>(null)
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    if (booking?.status === "COMPLETED" && booking.paymentId) {
      dispatch(employee_get_payment_service(booking.paymentId))
        .unwrap()
        .then((result) => {
          console.log("result", result)
          setPaymentDetails(result)
        })
        .catch((error) => {
          console.error("Failed to fetch payment details:", error)
        })
    }
  }, [dispatch, booking])

  if (!booking) {
    return <p className="text-center text-gray-500">Booking not found.</p>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        {/* <h2 className="text-3xl font-bold text-gray-800">Booking Details</h2> */}
        <button 
  onClick={onClose} 
  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
>
  ← Back
</button>

      </div>
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{booking.jobName}</h3>
            <p className="text-gray-600">{booking.problem}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-gray-400" />
            <span>
              User: {booking.userName} ({booking.userEmail})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
            <span>Location: {booking.userLocation.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <span>Booking Date: {new Date(booking.bookingDate).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <span>Accept Time: {new Date(booking.acceptEmployee.acceptTime || "").toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            <span>Job Name: {booking.jobName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            <span>Minimum Wage: ₹{booking.minWage}</span>
          </div>
        </div>

        {/* Payment Details */}
        {paymentDetails && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span>Name: {paymentDetails.serviceDetails.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TruckIcon className="h-5 w-5 text-gray-400" />
                <span>Vehicle Number: {paymentDetails.serviceDetails.vehicleNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                <span>Problem: {paymentDetails.serviceDetails.problem}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span>Phone: {paymentDetails.serviceDetails.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <span>Amount: ₹{paymentDetails.amount}</span>
              </div>
              {/* <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span>Employee ID: {paymentDetails.employeeId}</span>
              </div> */}
              {/* <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span>User ID: {paymentDetails.userId}</span>
              </div> */}
              <div className="flex items-center space-x-2">
                <CreditCardIcon className="h-5 w-5 text-gray-400" />
                <span>Payment Status: {paymentDetails.status || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span>
                  Created At: {paymentDetails.createdAt ? new Date(paymentDetails.createdAt).toLocaleString() : "N/A"}
                </span>
              </div>
              {/* <div className="flex items-center space-x-2">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                <span>Job Name: {paymentDetails.jobName}</span>
              </div> */}
              {/* <div className="flex items-center space-x-2">
                <ReceiptRefundIcon className="h-5 w-5 text-gray-400" />
                <span>Service ID: {paymentDetails.serviceId}</span>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Emp_BookingDetail

