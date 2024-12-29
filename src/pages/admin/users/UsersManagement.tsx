import { useDispatch, useSelector } from "react-redux";
import AdminHeader from "../../../components/admin/header/AdminHeader";
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { admin_Block_UnBlock_User, Admin_get_users } from "../../../reducers/admin/adminapicalls";
import { UserStateTypes } from "../../../types/clients/UsersTypes";
import EditUsermodal from "./EditUsermodal";
import { updateUsers } from "../../../reducers/admin/adminReducers";

const UsersManagement = () => {
    const [editEmp,setEditEmp]=useState<UserStateTypes>({
      id:"",
      username:"",
      email:'',
      phone:"",
      profilePic:"",
   
    })
    const [searchitem,setSearchItem]=useState<string>("")

    const [showEditModal,setShowEditModal]=useState<boolean>(false)
    const {users}=useSelector((state:RootState)=>state.admin)
    const dispatch:AppDispatch=useDispatch()


    useEffect(()=>{
        dispatch(Admin_get_users())

    },[dispatch])
    const handleCloseModal=()=>{
        setShowEditModal(false)
      }
      const handleBlock=(id:string)=>{
        console.log("employeeId",id);
        
        dispatch(admin_Block_UnBlock_User(id))
        .unwrap()
        .then((updateData)=>{
        dispatch(updateUsers(updateData))
        
        })
        
      }
      
      const filterSerch=users.filter((user:UserStateTypes)=>
        user.username.toLowerCase().includes(searchitem.toLowerCase())||
        user.email.toLowerCase().includes(searchitem.toLowerCase()))
   
   
  return (
    <>
      {showEditModal && <EditUsermodal users={editEmp} onclose={handleCloseModal} />}


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
              <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                Filters
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    {/* <th className="text-left p-4">Pic</th> */}
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Phone</th>
                    <th className="text-left p-4">Block</th>
                    <th className="text-left p-4">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {filterSerch.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="flex items-center gap-4 p-4">
                        <img
                          src={user.profilePic as string}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{user.username}</span>
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.phone}</td>

                      <td className="p-4">
                        <button
                          className={`px-4 py-2 text-white rounded ${
                            user.isActive ? "bg-red-700" : "bg-green-700"
                          }`}
                          onClick={()=>handleBlock(user.id)}
                        >
                          {user.isActive ? "Block" : "Unblock"}
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          className="px-4 py-2 text-white rounded bg-green-700"
                          onClick={() => {
                            setShowEditModal(true);
                            setEditEmp({
                              id: user.id,
                              username: user.username,
                              email: user.email,
                              phone: user.phone,
                              profilePic: user.profilePic as string,
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
  )
}

export default UsersManagement