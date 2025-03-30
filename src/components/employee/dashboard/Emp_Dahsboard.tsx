import React, { useEffect, useState, useMemo } from 'react';
import { Wrench, Car, Clock, CheckCircle, Briefcase, Loader, MapPin } from 'lucide-react';
import { AppDispatch, RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { employee_get_reqServices, Employee_put_ActiveToogle, Employee_put_withDrawMoney } from '../../../reducers/employees/EmployeeApicalls';
import { useNavigate } from 'react-router-dom';
import { ToastMsg } from '../../../types/admin/admintypes';
import ToastAlert from '../../alert/ToastAlert';
import { changeRevenu, empchangewalletBallence } from '../../../reducers/employees/EmployeeReducers';

const Emp_Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { employee, reqService_booking } = useSelector((state: RootState) => state.employee);
  const [isActive, setIsActive] = useState<boolean>(employee?.onDuty || false);
 const[showmsg,setShowmsg]=useState<ToastMsg>({
    action:false,
    message:"",
    type:"idle"
  })



const navigate=useNavigate()

const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false); // State for withdrawal modal
  const [withdrawAmount, setWithdrawAmount] = useState(''); 

  
  const handleWithdrawConfirm = () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount))) {
      // alert('Please enter a valid amount.');
      setShowmsg({action:true,message:"Please enter a valid amount.",type:'error'})
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount <=  100) {
      // alert('Withdrawal amount must be greater than 0.');
      setShowmsg({action:true,message:"Withdrawal amount must be greater than 100.",type:'info'})


      return;
    }

    if (employee?.revenue && amount > employee.revenue) {
      // alert('Insufficient balance.');
      setShowmsg({action:true,message:"Insufficient balance.",type:'error'})

      return;
    }

    // Add your withdrawal logic here (e.g., API call)
    // alert(`Withdrawing ₹${withdrawAmount}`);

    dispatch(Employee_put_withDrawMoney({empId:employee?.id||"",amount:amount})).unwrap()
    .then((res)=>{
      console.log(res);
      setShowmsg({action:true,message:`credited ${amount}`,type:'success'})
      
      dispatch(empchangewalletBallence(res.balance)); // Dispatch the changeRevenu action
      
    })
    dispatch(changeRevenu(amount)); // Dispatch the changeRevenu action
    
    setIsWithdrawModalOpen(false);
    setWithdrawAmount('');
  };

  // Handle withdrawal cancel
  const handleWithdrawCancel = () => {
    setIsWithdrawModalOpen(false);
    setWithdrawAmount('');
  };

  


  useEffect(() => {
    console.log("emp duty toogle",employee?.onDuty)
    
    setIsActive(employee?.onDuty ?? false);
  }, [employee?.onDuty]);
  
  
  
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

  const handleActiveToogle=(id:string)=>{
    setIsActive(!isActive)
    console.log("duty",!isActive)
    

    const data:{id:string,duty:boolean}={
      id:id,
      duty:!isActive
    }
    dispatch(Employee_put_ActiveToogle(data))
    
  }



  // const handleWithdrawMoney=(mone)=>{
    
    
  // }
  return (
    <>
        {showmsg.action && <ToastAlert onClose={()=>setShowmsg((prev)=>({...prev,action:false}))} message={showmsg.message} type={showmsg.type as "info"|"success"|"error"} />}

    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Mechanic Dashboard</h2>
          <button
  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition w-fit text-sm sm:text-base"
  onClick={() => navigate(`/employee/change-location/${employee.id}`)}
>
  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" /> Change Location
</button>

        <div className=" flex items-center ">
          <span className="text-lg font-medium mr-3">Active Status:</span>
          <button
            onClick={()=>handleActiveToogle(employee.id)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              isActive ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                isActive ? 'translate-x-7' : 'translate-x-0'
              }`}
            ></div>
          </button>
          <span className={`ml-3 font-semibold ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>

        </div>
                 </div>

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
              <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"  onClick={() => setIsWithdrawModalOpen(true)}>
    Withdraw
  </button>
            </div>
          </div>
        </div>

        {isWithdrawModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Withdraw Funds</h2>
              <input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  onClick={handleWithdrawCancel}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={handleWithdrawConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
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
                </>
  );
};

export default Emp_Dashboard;

