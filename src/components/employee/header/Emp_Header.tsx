import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearEmp } from "../../../reducers/employees/EmployeeReducers";
import { employee_get_details, Employee_get_Logout } from "../../../reducers/employees/EmployeeApicalls";
import { useEffect, useState } from "react";
import { IoIosChatboxes } from "react-icons/io";


const Emp_Header = () =>{
  const [unreadMessages, setUnreadMessages] = useState(3); // Example state for unread messages

  const{employee}=useSelector((state:RootState)=>state.employee)
    const employeeId=employee?.id
    const navigate=useNavigate()
    const dispatch:AppDispatch=useDispatch()
    useEffect(()=>{
     if (employeeId) {
      dispatch(employee_get_details(employeeId))
     }
    },[dispatch,employeeId])
    
    // const employeeId ="6761c55438aef451f8053be6" ; 
    // Example hardcoded employee ID; replace with actual logic to fetch employee ID
    // const userId="676589fdb941ebfae5c5bb6c";
    
  
    
  const handleInboxClick = () => {
    // Navigate to inbox or open inbox modal
    console.log("Opening inbox");
    // Reset unread messages count
    // navigate('/employee/emp-chatt')
    navigate('/employee/chat')
    setUnreadMessages(0);
  };
    return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="text-lg font-semibold">
        Hi, {employee?.username} <span className="text-gray-500">Let’s check your Garage today</span>
      </div>
      <div className="flex items-center space-x-4">
        {/* <input
          type="text"
          placeholder="Search..."
          className="border rounded-md px-4 py-2"
        /> */}
      <div className="flex items-center space-x-9">
    
      <button 
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors relative"
            onClick={handleInboxClick}
          >
            <IoIosChatboxes className="h-5 w-5 text-gray-600" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>

  <button className="p-2 bg-gray-200 rounded-full">🔔</button>
  <button className="p-2 bg-gray-200 rounded-full">⚙️</button>
        <div className="flex items-center">
  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden hover:cursor-pointer"  onClick={()=>navigate('/employee/profile')}>
            <img
              src={employee?.profilePic}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
            </div>
    {/* <img 
      src={`${employee?.profilePic}` || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
      alt="Default Profile Picture" 
      width="40"  // Reduced size for a smaller profile picture
      height="40" // Reduced size for a smaller profile picture
      onClick={() => navigate('/employee/profile')}
      className="rounded-full hover:cursor-pointer " // Ensures the image remains circular
    /> */}
    <span className="ml-2 font-medium">{employee?.username}</span>
  </div>
</div>

 <button className="ml-2 p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      onClick={()=>{
                        dispatch(Employee_get_Logout())
                        dispatch(clearEmp())
                        

                      
                        navigate('/employee/login')
          
          
          
                      }}
                      >
            Logout
          </button>
        </div>
     
    </header>
  );
}
  export default Emp_Header