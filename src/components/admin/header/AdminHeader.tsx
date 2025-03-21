import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../store/store"
import { clearAdmin } from "../../../reducers/admin/adminReducers"
import { useNavigate } from "react-router-dom"

const AdminHeader = () => {
  const dispatch:AppDispatch=useDispatch()
  const navigate=useNavigate()
  return (
    <>
      <header className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="text-lg font-semibold">
        Hi, Sujith <span className="text-gray-500">Let’s check your Garage today</span>
      </div>
      <div className="flex items-center space-x-4">
        {/* <input
          type="text"
          placeholder="Search..."
          className="border rounded-md px-4 py-2"
        /> */}
        <div className="flex items-center space-x-9">
          <button className="p-2 bg-gray-200 rounded-full">🔔</button>
          <button className="p-2 bg-gray-200 rounded-full">⚙️</button>
          <div className="flex items-center">
          <img 
  src="https://res.cloudinary.com/ded1lrbaz/image/upload/v1740765152/linkdindp_qzccet.jpg" 
  alt="Default Profile Picture" 
  className="w-9 h-9 rounded-full object-cover"

/>

            <span className="ml-2 font-medium">Sujith</span>
            <button className="ml-2 p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            onClick={()=>{
              dispatch(clearAdmin())
              localStorage.removeItem('admin');
              navigate('/admin/login')



            }}
            >
  Logout
</button>

          </div>
        </div>
      </div>
    </header>
    </>
  )
}

export default AdminHeader