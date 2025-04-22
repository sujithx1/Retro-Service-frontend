import { useCallback, useEffect, useState } from "react";
import {  Razorpay_Service_types, Response_Req_service_employee_types, ServicePayment_section } from "../../../types/clients/UsersTypes";
import { AppDispatch,  } from "../../../store/store";
import { useDispatch, } from "react-redux";
import { User_get_reqService, User_post_advanceConfirm, User_post_Razorpay } from "../../../reducers/users/UserapiCalls";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RazorpayOptions } from "../../../components/payments/Razorypay";

// Define Razorpay types
interface Razorpay {
  new (options: RazorpayOptions): RazorpayInstance;
  open(): void;
}

interface RazorpayInstance {
  open(): void;
}

declare global {
  interface Window {
    Razorpay: Razorpay;
  }
}

const RazorpayPaymentAdvance = () => {
  const [loading, setLoading] = useState(true); // Start in loading state
  const [reqService, setReqservice] = useState<Response_Req_service_employee_types | null>(null);
  const [params] = useSearchParams();
  const bookingId = params.get("service");
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch service details on first render
  useEffect(() => {
    if (!bookingId) return;

    dispatch(User_get_reqService(bookingId))
      .unwrap()
      .then((res) => {
        setReqservice(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching service:", err);
        toast.error("Failed to load booking details.");
        navigate("/payment-failed");
      });
  }, [dispatch, bookingId, navigate]);

  // After successful payment, update database
  const successPayment = useCallback(async () => {
    if (!reqService) {
      toast.error("Service not found.");
      
      return;
    }
   

    const data: ServicePayment_section = {
      amount: 100,
      employeeId: reqService.acceptEmployee.employeeId,
      serviceId: reqService.id,
      userId: reqService.userId,
      jobName:reqService.jobName,
      name:reqService.userName,
      phone:"Invalid",
      problem:reqService.problem,
      vehicleNumber:"Invalid",


    };

    try {
      await dispatch(User_post_advanceConfirm(data))
        .unwrap()
        .then((result) => {
          console.log("Payment success:", result);
          toast.success("Payment Successful!");
          localStorage.removeItem("paymentStarted"); // ✅ Reset payment status

          navigate("/booking-history");
        })
        .catch((err) => {
          toast.error("Payment verification failed."+err);
          localStorage.removeItem("paymentStarted"); // ✅ Reset payment status

          navigate("/payment-failed");
        });
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Payment confirmation failed.");
    }
  }, [dispatch, navigate, reqService]);
  
  const handlePayment = useCallback(async () => {
    try {
      setLoading(true);
      const paymentData: Razorpay_Service_types = {
        amount: 100,
        currency: "INR",
        receipt: "receipt-1",
      };
  
      // Step 1: Create Razorpay Order
      const response = await dispatch(User_post_Razorpay(paymentData)).unwrap();
  
      // Step 2: Open Razorpay Checkout
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Your Razorpay Key
        amount: response.amount,
        currency: "INR",
        name: "Retro Service",
        description: "Booking Confirmation Fee",
        image: "/your_logo.png",
        order_id: response.id,
  
        handler: function (response) {
          console.log("Payment successful! Payment ID:", response.razorpay_payment_id);
          successPayment();
        },
        
        prefill: {
            name: "Sujith",
            email: "sujith@example.com",
            contact: "7994591023",
        },
        theme: {
            color: "#3399cc",
        },
        modal: {
          escape: true, // Allow users to close via "ESC"
          ondismiss: function () {
            console.log("User canceled the payment.");
            toast.warn("Payment was canceled. Please try again.");
            setLoading(false); // Reset loading state
            navigate('/home')
          },
  
    }
  }


    
    const rzp = new window.Razorpay(options);
    rzp.open();
} catch (error) {
    console.error("Payment error:", error);
    toast.error("Payment failed!");
    navigate("/payment-failed");
} finally {
    setLoading(false);
}
}, [dispatch, navigate, successPayment]); // ✅ Dependencies added

  useEffect(() => {
    if (!reqService) return; // Wait until service details are fetched
    handlePayment();
  }, [reqService, handlePayment]); // ✅ No more warnings
  

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Processing Payment...</p>
          <div className="animate-spin mt-3 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <p className="text-lg font-semibold text-gray-700">Redirecting...</p>
      )}
    </div>
  );
};

export default RazorpayPaymentAdvance;
