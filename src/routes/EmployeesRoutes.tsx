

import { Routes,Route } from "react-router-dom";
import EmployeeSignup from "../pages/employees/signup/EmployeeSignup";
import Emp_Home from "../pages/employees/home/Emp_Home";
import NotFound from "../components/NotFound";
import Emp_Login from "../pages/employees/login/Emp_Login";
import Profile_Employee from "../pages/employees/profile/Profile_Employee";
import Emp_protecter from "../components/employee/protect/Emp_protecter";
import Emp_jobs from "../pages/employees/jobs/Emp_jobs";
import UnconfirmedBookings from "../pages/employees/booking/Emp_Booking";

const EmployeesRoutes = () => {
  return (
    <>
    <Routes>


       
        <Route path="signup" element={<EmployeeSignup/>}/>
        <Route path="home" element={
          <Emp_protecter>

            <Emp_Home/>
           </Emp_protecter> 
          }/>
        <Route path="login" element={
          <Emp_Login/>
          }/>
        <Route path="profile" element={
          <Emp_protecter>

            <Profile_Employee/>
          </Emp_protecter>
          }/>
        <Route path="jobs" element={
          <Emp_protecter>

            <Emp_jobs/>
          </Emp_protecter>
          }/>
        <Route path="booking" element={

            <UnconfirmedBookings/>
          }/>
        <Route path="*" element={<NotFound />} />
    </Routes>
      
    </>
  )
}

export default EmployeesRoutes
