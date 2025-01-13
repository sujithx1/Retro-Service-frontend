import React, { ChangeEvent, useState } from 'react';
import { CreditCard, ShoppingCart, IndianRupee, Car, Phone, User, FileText } from 'lucide-react';
import Razorpay from '../../../components/payments/Razorypay';
import { ServicePayment_section } from '../../../types/clients/UsersTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

type PaymentMethod = 'stripe' | 'paypal' | 'razorpay';

export default function UserPayment() {
    const { reqService } = useSelector((state: RootState) => state.user);
    const [formData, setFormData] = useState<ServicePayment_section>({
        name: '',
        problem: '',
        vehicleNumber: '',
        phone: '',
        amount: 0,
        employeeId: reqService.acceptEmployee.employeeId,
        userId: reqService.userId,
        jobName:reqService.jobName,
        serviceId:reqService.id
       
    });
    
    const { amount, name, phone, problem, vehicleNumber } = formData;
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
    const [showRazorpay, setShowRazorpay] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Handle amount separately to ensure it's a number
        if (name === 'amount') {
            setFormData(prevData => ({
                ...prevData,
                [name]: value === '' ? 0 : parseFloat(value)
            }));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === 'razorpay') {
            setShowRazorpay(true);
        }
    };

    return (
        <>
            {showRazorpay && <Razorpay service={formData} />}
            <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
                <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <img
                        src="/Accept Evrything.gif"
                        alt="Vehicle service hero image"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Service Details</h2>
                        <p className="text-gray-600">Enter your details and choose a payment method.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 inline-flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    <span>Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="vehicleNumber" className="text-sm font-medium text-gray-700 mb-1 inline-flex items-center">
                                    <Car className="h-4 w-4 mr-2" />
                                    <span>Vehicle Number</span>
                                </label>
                                <input
                                    type="text"
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="ABC 1234"
                                    value={vehicleNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="problem" className="text-sm font-medium text-gray-700 mb-1 inline-flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                <span>Problem Description</span>
                            </label>
                            <textarea
                                id="problem"
                                name="problem"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                placeholder="Describe the issue with your vehicle"
                                value={problem}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 inline-flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="+1 234 567 8900"
                                value={phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-1 inline-flex items-center">
                                <IndianRupee className="h-4 w-4 mr-2" />
                                <span>Amount</span>
                            </label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter amount in INR"
                                value={amount || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 inline-flex items-center">
                                <CreditCard className="h-4 w-4 mr-2" />
                                <span>Payment Method</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { value: 'stripe', label: 'Credit Card (Stripe)', icon: CreditCard },
                                    { value: 'paypal', label: 'PayPal', icon: ShoppingCart },
                                    { value: 'razorpay', label: 'Razorpay', icon: IndianRupee },
                                ].map((method) => (
                                    <label
                                        key={method.value}
                                        className={`inline-flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-colors ${
                                            paymentMethod === method.value ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.value}
                                            checked={paymentMethod === method.value}
                                            onChange={() => setPaymentMethod(method.value as PaymentMethod)}
                                            className="form-radio text-blue-600"
                                        />
                                        <div className="inline-flex items-center space-x-2">
                                            <method.icon className="h-5 w-5 text-gray-600" />
                                            <span>{method.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Proceed to Payment
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}