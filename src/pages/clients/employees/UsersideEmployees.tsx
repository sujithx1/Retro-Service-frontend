import { useEffect, useState } from "react";
import UserHeader from "../../../components/client/header/Header";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { User_get_Employees } from "../../../reducers/users/UserapiCalls";

const UsersideEmployees = () => {
 const dispatch:AppDispatch=useDispatch()
 const [searchTerm,setSearchTerm] = useState('');
useEffect(()=>{
    dispatch(User_get_Employees())
},[dispatch])
const {employees}=useSelector((state:RootState)=>state.admin)

const filteredEmployees = employees.filter(employee => {
  return (
    employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.skills.some(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    (employee.location && employee.location.address.suburb.toLowerCase().includes(searchTerm.toLowerCase()))
  );
});

  return (

<div className="p-6 space-y-8">
      <UserHeader />
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Employee Cards */}
      <div className="flex flex-wrap gap-6 justify-center">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee, index) => (
            <div
              key={index}
              className="max-w-xs w-full flex flex-col items-center bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="relative mb-4">
                <img
                  src={employee.profilePic || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                  alt={employee.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
               
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">{employee.username}</h2>
                <h4 className="text-md text-gray-500 mb-2">{employee.skills[0]}</h4>
                <p className="text-gray-400 mb-4">{employee.location?.address.suburb || "Location not specified"}</p>
                <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No employees found.</p>
        )}
      </div>
    </div>  
  );
};



export default UsersideEmployees