import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { Response_ServiceBooking_History_types } from "../../../types/clients/UsersTypes";
import { BriefcaseIcon, CalendarIcon, ClockIcon, CreditCardIcon, MapPinIcon, PhoneIcon, TruckIcon, UserIcon } from "lucide-react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { User_get_servicePayment } from "../../../reducers/users/UserapiCalls";
import { useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



const UserBookingDetails = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  console.log("booking id ", bookingId);

  const booking = useSelector((state: RootState) =>
    state.user.bookingHistories.find((b) => b.id === bookingId)
  );
  const [paymentDetails, setPaymentDetails] = useState<Response_ServiceBooking_History_types | null>(null);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    console.log("bookinng", booking);

    if ((booking?.status === "CONFIRMED" || booking?.status === "COMPLETED") && booking.paymentId) {
      dispatch(User_get_servicePayment(booking.paymentId))
        .unwrap()
        .then((result) => {
          console.log("result", result);
          setPaymentDetails(result);
        })
        .catch((error) => {
          console.error("Failed to fetch payment details:", error);
        });
    }
  }, [dispatch, booking]);

  if (!booking) {
    return <p className="text-center text-gray-500">Booking not found.</p>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-white-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleDownloadInvoice = () => {
    if (!paymentDetails) return;
    const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const margin = 15

  // Set document properties
  doc.setProperties({
    title: `Invoice ${paymentDetails.id}`,
    subject: "Service Invoice",
    author: "Retron-service",
    keywords: "invoice, service, payment",
    creator: "Retron-service Invoice Generator",
  })

  // Add logo (optional)
  const logoUrl = "/projecticon.png"
  doc.addImage(logoUrl, "PNG", margin, margin, 40, 40)

  // Invoice header
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(41, 128, 185)
  doc.text("INVOICE", pageWidth - margin, 35, { align: "right" })

  // Company details
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100)
  doc.text(
    ["Retron-service", "Kochi, India", "Phone: +7994591023", "Email: retroservice@gmail.com"],
    pageWidth - margin,
    45,
    { align: "right" },
  )

  // Divider line
  doc.setDrawColor(200)
  doc.setLineWidth(0.5)
  doc.line(margin, 65, pageWidth - margin, 65)

  // Customer details and Invoice details
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0)
  doc.text("Bill To:", margin, 80)
  doc.text("Invoice Details", pageWidth / 2, 80)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const customerDetails = [
    `Name: ${paymentDetails.serviceDetails.name}`,
    `Phone: ${paymentDetails.serviceDetails.phone}`,
    `Vehicle: ${paymentDetails.serviceDetails.vehicleNumber}`,
  ]
  doc.text(customerDetails, margin, 90)

  const invoiceDetails = [
    `Invoice Number: INV-${paymentDetails.id}`,
    `Invoice Date: ${new Date(paymentDetails.createdAt || "").toLocaleDateString()}`,
    `Payment Status: ${paymentDetails.status || "N/A"}`,
  ]
  doc.text(invoiceDetails, pageWidth / 2, 90)

  // Service details
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(41, 128, 185)
  doc.text("Service Details", margin, 120)

  const serviceData = [
    ["Service Name", "Problem", "Amount", "Advance", "Total"],
    [
      paymentDetails.serviceDetails.name,
      paymentDetails.serviceDetails.problem,
      `${paymentDetails.amount}`,
      "100",
      `${paymentDetails.amount + 100}`,
    ],
  ]

  autoTable(doc, {
    startY: 125,
    head: serviceData.slice(0, 1),
    body: serviceData.slice(1),
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 5 },
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 35, halign: "left" },
      3: { cellWidth: 35, halign: "left" },
      4: { cellWidth: 35, halign: "left" },
    },
    margin: { left: margin, right: margin },
  });

  // Total amount
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.setFont("NotoSans", "normal"); // 'times' supports ₹ better
  doc.text(`Total Amount: ${paymentDetails.amount + 100}`, pageWidth - margin - 20, doc.lastAutoTable.finalY + 15, {
    align: "right",
  });
  

  // Footer
  doc.setFontSize(10)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(100)
  doc.text("Thank you for choosing our services!", margin, 280)
  doc.text("Terms & Conditions apply.", margin, 285)

  // Save the PDF
  doc.save(`invoice_${paymentDetails.id}.pdf`)


}
  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          {/* <h2 className="text-3xl font-bold text-gray-800">Booking Details</h2> */}
          {/* <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XMarkIcon className="h-6 w-6" />
        </button> */}
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

          {/* Download Invoice Button (Conditional Rendering) */}
          {(booking.status === "CONFIRMED" || booking.status === "COMPLETED") && (
            <div className="mb-4">
              <button
                onClick={handleDownloadInvoice}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Download Invoice
              </button>
            </div>
          )}

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
            {booking.status !== "CANCELLED" && (
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span>Accept Time: {new Date(booking.acceptEmployee.acceptTime || "").toLocaleString()}</span>
              </div>
            )}
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
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  <span>Advance: ₹100</span>
                </div>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserBookingDetails;