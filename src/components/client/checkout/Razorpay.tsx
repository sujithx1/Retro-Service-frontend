import { useCallback, useEffect, useState } from "react";
import { Cart, Checkout_paymentTypes, Razorpay_Service_types } from "../../../types/clients/UsersTypes";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { User_get_CartnyUserId, User_post_chekoutRazorpay, User_post_Razorpay } from "../../../reducers/users/UserapiCalls";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
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

const RazorpayCheckout = () => {

    const [loading, setLoading] = useState(true);
    const [cartDetails, setCartDetails] = useState<Cart | null>(null);
const [isPaymentStarted, setIsPaymentStarted] = useState(false); // Prevent multiple calls


const {id} =useParams()
console.log(id);

const dispatch: AppDispatch = useDispatch();
const navigate = useNavigate();


// Fetch Cart Details
useEffect(() => {
  if (!id) return;
  
  dispatch(User_get_CartnyUserId(id))
    .unwrap()
    .then((res) => {
      setCartDetails(res);
      setLoading(false); // ✅ Stop loading after fetching cart details
    })
    .catch((err) => {
      console.error("Error fetching cart details:", err);
      toast.error("Failed to load cart details.");
      navigate("/payment-failed");
    });
}, [dispatch, id, navigate]);

// Handle Successful Payment
const successPayment = useCallback(async (paymentId:string) => {
    if (!cartDetails) {
    toast.error("Cart not found.");
    return;
}

const data: Checkout_paymentTypes = {
    cartId: cartDetails.id,
    total: cartDetails.products.reduce((res, product) => res + product.price , 0),
    paymentMethode:'razorpay',
    transactionId:paymentId
};
console.log(data);



try {
    await dispatch(User_post_chekoutRazorpay(data))
      .unwrap()
      .then((result) => {
        console.log("Payment success:", result);
        toast.success("Payment Successful!");
        navigate("/order-history");
      })
      .catch((err) => {
          toast.error("Payment verification failed: " + err);
        navigate("/payment-failed");
    });
} catch (error) {
    console.error("Error confirming payment:", error);
    toast.error("Payment confirmation failed.");
}
}, [dispatch, navigate, cartDetails]);

// Handle Razorpay Payment
const handlePayment = useCallback(async () => {
  if (!cartDetails || isPaymentStarted) return; // Prevent multiple triggers
  setIsPaymentStarted(true); // ✅ Prevent multiple executions

  try {
      setLoading(true);
    const totalAmount = cartDetails.products.reduce((res, product) => res + product.price, 0);
    const paymentData: Razorpay_Service_types = {
      amount: totalAmount,
      currency: "INR",
      receipt: "receipt-1",
    };
    
    // Step 1: Create Razorpay Order
    const response = await dispatch(User_post_Razorpay(paymentData)).unwrap();
    console.log("Razorpay order created:", response);
    
    // Step 2: Open Razorpay Checkout
    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: response.amount,
      currency: "INR",
      name: "Retro Service",
      description: "Booking Confirmation Fee",
      image: "/your_logo.png",
      order_id: response.id,
    
      
      
      handler:  function (response) {
          console.log("Payment successful! Payment ID:", response.razorpay_payment_id);
          
        successPayment(response.razorpay_payment_id);
      },

      prefill: {
          name: "Sujith",
          email: "sujith@example.com",
          contact: "9876543210",
        },
      theme: {
        color: "#3399cc",
      },
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Payment failed!");
    navigate("/payment-failed");
  } finally {
    setLoading(false);
  }
}, [dispatch, navigate, successPayment, cartDetails, isPaymentStarted]);

// Call `handlePayment` only **after cartDetails is set**
useEffect(() => {
  if (cartDetails ) {
    console.log("callign handleayment");
    
    handlePayment();
  }
}, [cartDetails,handlePayment]); // ✅ No more infinite loops

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

export default RazorpayCheckout;
