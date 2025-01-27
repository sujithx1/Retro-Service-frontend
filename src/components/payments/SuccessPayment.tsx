import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewRating from '../client/review/ReviewRating';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { User_get_servicePayment } from '../../reducers/users/UserapiCalls';
import { Response_ServiceBooking_History_types } from '../../types/clients/UsersTypes';

export default function PaymentSuccess() {
  const [showReview,setShowReview]=useState(false)
  const dispatch:AppDispatch=useDispatch()
  const [paymentDetails,setPaymentDetails]=useState<Response_ServiceBooking_History_types>()
      const navigate=useNavigate()
    const location=useLocation()
    const {paymentId}=location.state||{}
    console.log("paymentid",paymentId);
    

    useEffect(()=>{
      dispatch(User_get_servicePayment(paymentId)).unwrap()
      .then((result) => {
        console.log("payment success page",result);
        
        setPaymentDetails(result)
        
      })

    },[dispatch,paymentId])

   
    console.log(paymentDetails);
    

  return (
    <>
    {
      showReview &&paymentDetails?
      <ReviewRating paymentDetails={paymentDetails} />
      :
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Successful!</h2>
        <p className="text-gray-600 mt-2">Thank you for your payment. Your transaction has been completed successfully.</p>
        
        <div className="mt-6">
          <p className="text-gray-500 text-sm">Transaction ID:</p>
          <p className="text-gray-800 font-semibold">#123456789</p>
        </div>
        
        <button
          onClick={() =>navigate('/home')} // Adjust the navigation as needed
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Go to Homepage
        </button>
        <button
          onClick={() =>setShowReview(true)} // Adjust the navigation as needed
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
          Review
        </button>
      </div>
    </div>
        }
          </>
  );
}
