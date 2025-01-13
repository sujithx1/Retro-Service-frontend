import React, { useEffect } from 'react';
import { Calendar, Clipboard, FileText, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import UserHeader from '../header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { User_get_bookingHistories } from '../../../reducers/users/UserapiCalls';

const UserBookingHistory: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { user, bookingHistories } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (user) {
            dispatch(User_get_bookingHistories(user.id));
        }
    }, [user, dispatch]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            case 'CANCELLED':
                return <XCircle className="h-6 w-6 text-red-500" />;
            case 'PENDING':
                return <Clock className="h-6 w-6 text-yellow-500" />;
            default:
                return null;
        }
    };

    return (
        <>
            <UserHeader />
            <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Service History</h2>
                {bookingHistories.length === 0 ? (
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <p className="text-xl text-gray-700">No service history available.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookingHistories.map((booking, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">{booking.jobName}</h3>
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(booking.status || '')}
                                            <span
                                                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                                    booking.status === 'COMPLETED'
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.status === 'CANCELLED'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-base text-gray-600">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-blue-500" />
                                            <span>{new Date(booking.createdAt as string).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Clipboard className="h-5 w-5 text-purple-500" />
                                            <span>{booking.serviceDetails.vehicleNumber}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-start space-x-3 text-base text-gray-700">
                                        <FileText className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                                        <p className="line-clamp-3">{booking.serviceDetails.problem}</p>
                                    </div>
                                    <div className="mt-4 flex items-center space-x-3 text-base text-gray-700">
                                        <DollarSign className="h-5 w-5 text-green-500" />
                                        <span className="font-semibold">Amount: ${booking.amount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default UserBookingHistory;
