import { XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
    const navigate=useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Failed</h2>
        <p className="text-gray-600 mt-2">
          Unfortunately, your payment could not be processed. Please try again later or contact support for assistance.
        </p>
        
        <div className="mt-6">
          <p className="text-gray-500 text-sm">Error Code:</p>
          <p className="text-gray-800 font-semibold">#ERR_PAYMENT_123</p>
        </div>
        
        <button
          onClick={() => navigate('/home')} // Adjust the navigation as needed
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Retry Payment
        </button>
        <button
          onClick={() => window.location.href = '/support'} // Adjust the navigation as needed
          className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}
