import React, { useEffect, useState, useMemo } from 'react';
import { Wrench, Car, Clock, CheckCircle, Briefcase, Loader } from 'lucide-react';
import { AppDispatch, RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { employee_get_reqServices } from '../../../reducers/employees/EmployeeApicalls';

const Emp_Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { employee, reqService_booking } = useSelector((state: RootState) => state.employee);
  
  const { completedCount, pendingCount } = useMemo(() => {
    console.log("Calculating counts. reqService_booking:", reqService_booking);
    return {
      completedCount: reqService_booking.filter((item) => item.status === 'COMPLETED').length,
      pendingCount: reqService_booking.filter((item) => item.status === "PENDING").length
    };
  }, [reqService_booking]);

  useEffect(() => {
    const fetchData = async () => {
      if (employee?.id) {
        console.log("Fetching data for employee ID:", employee.id);
        setIsLoading(true);
        setError(null);
        try {
          const result = await dispatch(employee_get_reqServices(employee.id)).unwrap();
          console.log("Fetched data:", result);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError('Failed to fetch service data. Please try again.');
          setIsLoading(false);
        }
      } else {
        console.log("No employee ID available");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employee, dispatch]);

  console.log("Render state:", { isLoading, error, employeeId: employee?.id, bookingsCount: reqService_booking.length });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-yellow-500">No employee data available. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-10">Mechanic Dashboard</h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Card 1: Total Services */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Services</h3>
              <p className="text-2xl font-bold text-gray-900">{reqService_booking.length}</p>
            </div>
          </div>

          {/* Card 2: Ongoing Repairs */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Car className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Ongoing Repairs</h3>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>

          {/* Card 3: Completed Works */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-md rounded-lg p-6 flex items-center">
            <div className="bg-white p-3 rounded-full shadow-md">
              <Briefcase className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4 text-white">
              <h3 className="text-lg font-semibold">Completed Works</h3>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
          </div>

          {/* Card 4: Revenue */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <span className="h-8 w-8 text-green-600 text-2xl">&#8377;</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">₹{employee?.revenue || 0}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity and Task List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Recent Activity</h3>
            <ul className="space-y-4">
              {reqService_booking
                .filter(item => item.bookingDate)
                .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
                .slice(0, 3)
                .map((item, index) => (
                  <li key={index} className="flex items-start space-x-4 border-b border-gray-200 pb-4">
                    <Clock className="h-6 w-6 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">{item.problem || 'No description available'}</p>
                      <span className="text-xs text-gray-400">{new Date(item.bookingDate).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {/* Task List */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Task List</h3>
            <ul className="space-y-4">
              {reqService_booking
                .filter(item => item.bookingDate)
                .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
                .slice(0, 3)
                .map((item, index) => (
                  <li
                    key={index}
                    className={`flex justify-between items-center border-b border-gray-200 pb-4 ${
                      item.status === 'COMPLETED' ? 'bg-green-50' : 'bg-yellow-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-600">{item.problem || 'No description available'}</p>
                    {item.status === 'COMPLETED' ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Clock className="h-6 w-6 text-yellow-500" />
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emp_Dashboard;

