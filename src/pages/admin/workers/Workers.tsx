import React, {  useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { admin_Block_UnBlock_employee, Admin_get_Employees } from "../../../reducers/admin/adminapicalls";
import EditWorkerModel from "./EditWorkerModel";
import { EmployeeStateTypes } from "../../../types/employee/EmployeeTypes";
import { toast } from "react-toastify";
import { reset, updateEmployee } from "../../../reducers/admin/adminReducers";
import AdminHeader from "../../../components/admin/header/AdminHeader";


const AdminWorkersTable: React.FC = () => {
  
const dispatch:AppDispatch=useDispatch()
const [editEmp,setEditEmp]=useState<EmployeeStateTypes>({
  id:"",
  username:"",
  email:'',
  phone:"",
  skills:[""],
  experience:0,
  profilePic:"",
  

})
const [showEditModal,setShowEditModal]=useState<boolean>(false)
const [searchitem,setSearchItem]=useState<string>("")
const {employees,isError,message}=useSelector((state:RootState)=>state.admin)

  useEffect(()=>{
    dispatch(Admin_get_Employees())
    if (isError) {
      toast(message)
      return
      
    }
    return ()=>{dispatch(reset())}

    

  },[dispatch,isError,message])
  const filterSerch=employees.filter((user:EmployeeStateTypes)=>
    user.username.toLowerCase().includes(searchitem.toLowerCase())||
    user.email.toLowerCase().includes(searchitem.toLowerCase()))



  // console.log(employees);
  const handleCloseModal=()=>{
    setShowEditModal(false)
  }
  const handleBlock=(id:string)=>{
    console.log("employeeId",id);
    
    dispatch(admin_Block_UnBlock_employee(id))
    .unwrap()
    .then((updateData)=>{
    dispatch(updateEmployee(updateData))
    
    })
    
  }
  
  return (
    <>
  {showEditModal && <EditWorkerModel editEmployee={editEmp} onclose={handleCloseModal} />}
      <div className="flex flex-col md:flex-row min-h-screen">
        <AdminSidebar />
        <div className="flex flex-col w-full">
          <AdminHeader />

          <div className="p-4 md:p-6 bg-gray-50 flex-1">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <input
                type="text"
                placeholder="Search by name, email, or others..."
                onChange={(e)=>setSearchItem(e.target.value)}
                className="w-full max-w-md p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {/* <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                Filters
              </button> */}
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    {/* <th className="text-left p-4">Pic</th> */}
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Phone</th>
                    <th className="text-left p-4">Skill</th>
                    <th className="text-left p-4">Experience</th>
                    <th className="text-left p-4">Block</th>
                    <th className="text-left p-4">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {filterSerch.map((worker) => (
                    <tr
                      key={worker.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="flex items-center gap-4 p-4">
                        <img
                          src={worker.profilePic as string}
                          alt={worker.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{worker.username}</span>
                      </td>
                      <td className="p-4">{worker.email}</td>
                      <td className="p-4">{worker.phone}</td>
                      <td className="p-4">{worker.skills.join(", ")}</td>
                      <td className="p-4">{worker.experience}</td>

                      <td className="p-4">
                        <button
                          className={`px-4 py-2 text-white rounded ${
                            worker.isActive ? "bg-red-700" : "bg-green-700"
                          }`}
                          onClick={()=>handleBlock(worker.id)}
                        >
                          {worker.isActive ? "Block" : "Unblock"}
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          className="px-4 py-2 text-white rounded bg-green-700"
                          onClick={() => {
                            setShowEditModal(true);
                            setEditEmp({
                              id: worker.id,
                              username: worker.username,
                              email: worker.email,
                              phone: worker.phone,
                              skills: worker.skills,
                              experience: worker.experience,
                              profilePic: worker.profilePic as string,
                              location: worker.location,
                            });
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
                    </>
  );
};

export default AdminWorkersTable;
