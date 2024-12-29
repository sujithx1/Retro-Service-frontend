import Emp_Dashboard from "../../../components/employee/dashboard/Emp_Dahsboard"
import Emp_Header from "../../../components/employee/header/Emp_Header"
import Emp_Sidebar from "../../../components/employee/sidebar/Emp_Sidebar"

const Emp_Home = () => {
  return (
    <div className="flex">
    <Emp_Sidebar/>
    <div className="flex flex-col w-full">
        <Emp_Header/>
        <Emp_Dashboard/>
    </div>
   </div>
  )
}

export default Emp_Home