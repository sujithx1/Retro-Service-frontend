import { Razorpay_Service_types, ServicePayment_section } from "../../types/clients/UsersTypes";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { User_post_confirm_Razorpay, User_post_Razorpay } from "../../reducers/users/UserapiCalls";
import { FC, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

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

interface Props {
  service: ServicePayment_section;
}

const RazorpayPayment: FC<Props> = ({ service }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate=useNavigate()

  const successPayment = useCallback(async () => {
    const data: ServicePayment_section = {
      amount: service.amount,
      name: service.name,
      phone: service.phone,
      problem: service.problem,
      vehicleNumber: service.vehicleNumber,
      employeeId: service.employeeId,
      userId: service.userId,
      jobName:service.jobName,
      serviceId:service.serviceId
    
      
    };

    try {
      await dispatch(User_post_confirm_Razorpay(data)).unwrap()
      .then(()=>{
        toast.success("success")
        navigate('/payment-success')

      }
      
    )
    .catch((err)=>{
        toast.error(err)
        navigate('/payment-failed')

    })
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment. Please try again.');
    }
  }, [dispatch, service,navigate]);

  useEffect(() => {
    const handlePayment = async () => {
      const payment: Razorpay_Service_types = {
        amount: service.amount,
        currency: 'INR',
        receipt: 'receipt#1',
      };

      try {
        const order = await dispatch(User_post_Razorpay(payment)).unwrap();

        const options: RazorpayOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: order.amount,
          currency: order.currency,
          name: 'Retro Service',
          description: 'Test Transaction',
          image: '/your_logo.png',
          order_id: order.id,
          handler: function (response) {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            successPayment();
          },
          prefill: {
            name: 'Your Name',
            email: 'email@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3399cc',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error('Error initiating payment:', error);
        alert('Failed to create order. Please try again.');
      }
    };

    handlePayment();
  }, [dispatch, service.amount, successPayment]);

  return null;
};

export default RazorpayPayment;
