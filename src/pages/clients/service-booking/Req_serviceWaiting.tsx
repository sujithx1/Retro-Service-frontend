import React, { useState, useEffect } from 'react';
import UserMap from '../map/UserMap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import UserHeader from '../../../components/client/header/Header';
import { User_get_reqService } from '../../../reducers/users/UserapiCalls';
import { useNavigate } from 'react-router-dom';

const ReqServiceWaiting: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('timeLeft');
    const startTime = localStorage.getItem('startTime');
    if (savedTime && startTime) {
      const elapsedTime = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
      const remainingTime = Math.max(0, 60 - elapsedTime);
      return remainingTime;
    }
    localStorage.setItem('startTime', Date.now().toString());
    localStorage.setItem('timeLeft', '60');
    return 60;
  });

  const [showContactOption, setShowContactOption] = useState(timeLeft === 0);
  const [showModal, setShowModal] = useState(false);

  const { reqService } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setShowContactOption(true);
          localStorage.removeItem('timeLeft');
          localStorage.removeItem('startTime');
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem('timeLeft', newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      localStorage.removeItem('timeLeft');
      localStorage.removeItem('startTime');
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (reqService.id) {
        try {
          const response = await dispatch(User_get_reqService(reqService.id)).unwrap();
          console.log('Booking status updated:', response);
          if (response.status === 'CONFIRMED') {
            navigate('/payment');
          }
        } catch (error) {
          console.error('Failed to fetch booking status:', error);
        }
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [reqService.id, dispatch, navigate]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('timeLeft');
      localStorage.removeItem('startTime');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <UserHeader />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <UserMap onclose={() => setShowModal(false)} />
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
              Booking in Progress
            </h2>

            {reqService && (
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-700">Service Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">{reqService.userName}</p>
                      <p className="text-sm text-gray-500">{reqService.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p>{reqService.jobName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p>{reqService.problem}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p>{reqService.userLocation.address}</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-700">Status: {reqService.status}</p>
                </div>
              </div>
            )}

            {!showContactOption ? (
              <div className="space-y-4">
                <p className="text-center text-gray-600">
                  Waiting for a mechanic to accept your request...
                </p>
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                      style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">
                      {timeLeft} {timeLeft === 1 ? 'second' : 'seconds'} remaining
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  No response received. You can contact the nearest service now.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                >
                  Contact Nearest Service
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReqServiceWaiting;

