import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
    const navigate=useNavigate()
  return (
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
      </div>
    </div>
  );
}
