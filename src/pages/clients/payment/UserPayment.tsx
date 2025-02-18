import React, { ChangeEvent, useEffect, useState } from 'react';
import {  IndianRupee, Car, Phone } from 'lucide-react';
import Razorpay from '../../../components/payments/Razorypay';
import { Response_Req_service_employee_types, ServicePayment_section } from '../../../types/clients/UsersTypes';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { useSearchParams } from 'react-router-dom';
import { User_get_reqService } from '../../../reducers/users/UserapiCalls';
import { toast } from 'react-toastify';

type PaymentMethod = 'stripe' | 'paypal' | 'razorpay';
interface FormErrors {
  vehicleNumber?: string;
  phone?: string;
  amount?: string;
  paymentMethod?: string;
}

export default function UserPayment() {
  const [params] = useSearchParams();
  const bookingId = params.get('bookingId');
  const dispatch: AppDispatch = useDispatch();
  const [reqService, setReqservice] = useState<Response_Req_service_employee_types | null>(null);

  const [formData, setFormData] = useState<ServicePayment_section>({
    vehicleNumber: '',
    phone: '',
    amount: 0, // Will update after fetching `reqService`
    employeeId: '',
    userId: '',
    jobName: '',
    serviceId: '',
    name:"",
    problem:'',

  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!bookingId) {
      toast.error('Invalid booking');
      return;
    }

    dispatch(User_get_reqService(bookingId))
      .unwrap()
      .then((res) => {
        setReqservice(res);

        // Update formData with fetched values
        setFormData((prev) => ({
          ...prev,
          amount: res.minWage - 100,
          employeeId: res.acceptEmployee?.employeeId || '',
          userId: res.userId || '',
          jobName: res.jobName || '',
          serviceId: res.id || '',
        }));
      })
      .catch((err) => console.log(err));
  }, [bookingId, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (reqService && formData.amount < (reqService.minWage-100))
      newErrors.amount = 'Amount should be at least the minimum wage';
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) newErrors.amount = 'Invalid amount';
    if (!paymentMethod) newErrors.paymentMethod = 'Please select a payment method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (paymentMethod === 'razorpay') {
        setShowRazorpay(true);
      }
    }
  };

  return (
    <>
      {showRazorpay && <Razorpay servicePaymentId={reqService?.paymentId||""} service={formData} />}
      <div className="w-full max-w-3xl mx-auto space-y-8 p-6">
        {/* Hero Section */}
        <div className="relative w-full h-56 rounded-lg overflow-hidden shadow-md">
          <img
            src="/Accept Evrything.gif"
            alt="Vehicle service hero image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Payment Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Payment</h2>
          <p className="text-gray-600 mb-6">Enter your details and choose a payment method to proceed.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Number */}
            <div>
              <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
                <Car className="inline-block w-5 h-5 mr-2 text-gray-500" />
                Vehicle Number
              </label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.vehicleNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ABC 1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
              />
              {errors.vehicleNumber && <p className="mt-1 text-xs text-red-500">{errors.vehicleNumber}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                <Phone className="inline-block w-5 h-5 mr-2 text-gray-500" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                <IndianRupee className="inline-block w-5 h-5 mr-2 text-gray-500" />
                Amount (INR)
              </label>
              <input
                type="text"
                inputMode="numeric"
                id="amount"
                name="amount"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Payment Method</label>
              <div className="flex space-x-4 mt-2">
                {['stripe', 'paypal', 'razorpay'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`px-4 py-2 border rounded-md transition ${
                      paymentMethod === method ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}
                    onClick={() => setPaymentMethod(method as PaymentMethod)}
                  >
                    {method.toUpperCase()}
                  </button>
                ))}
              </div>
              {errors.paymentMethod && <p className="mt-1 text-xs text-red-500">{errors.paymentMethod}</p>}
            </div>

            {/* Submit Button */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
