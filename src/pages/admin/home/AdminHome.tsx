import AdminDashboard from "../../../components/admin/dahsboard/AdminDashboard"
import AdminHeader from "../../../components/admin/header/AdminHeader"
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar"

const AdminHome = () => {
  return (
   <>
   <div className="flex">
    <AdminSidebar/>
    <div className="flex flex-col w-full">
        <AdminHeader/>
        <AdminDashboard/>
    </div>
   </div>
   </>
  )
}

export default AdminHome
