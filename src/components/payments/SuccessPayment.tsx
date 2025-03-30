import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewRating from '../client/review/ReviewRating';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { User_get_servicePayment } from '../../reducers/users/UserapiCalls';
import { Response_ServiceBooking_History_types } from '../../types/clients/UsersTypes';

export default function PaymentSuccess() {
  const [showReview, setShowReview] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const [paymentDetails, setPaymentDetails] = useState<Response_ServiceBooking_History_types>();
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId } = location.state || {};
  const { serviceId } = location.state || {};

  useEffect(() => {
    dispatch(User_get_servicePayment(paymentId)).unwrap()
      .then((result) => {
        setPaymentDetails(result);
      });
  }, [dispatch, paymentId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      {showReview && paymentDetails ? (
        <ReviewRating paymentDetails={paymentDetails} serviceId={serviceId} />
      ) : (
        <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          <h2 className="text-3xl font-extrabold text-gray-800 mt-4">Payment Successful!</h2>
          <p className="text-gray-600 mt-2 text-lg">Your transaction has been completed successfully.</p>

          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Transaction ID:</p>
            <p className="text-gray-800 font-semibold text-lg">{paymentDetails?.id}</p>
          </div>

          <div className="mt-6 flex flex-col space-y-4">
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => setShowReview(true)}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition duration-300"
            >
              Leave a Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}