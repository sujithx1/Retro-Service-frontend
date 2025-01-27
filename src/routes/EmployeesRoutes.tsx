

import { Routes,Route } from "react-router-dom";
import EmployeeSignup from "../pages/employees/signup/EmployeeSignup";
import Emp_Home from "../pages/employees/home/Emp_Home";
import NotFound from "../components/NotFound";
import Emp_Login from "../pages/employees/login/Emp_Login";
import Profile_Employee from "../pages/employees/profile/Profile_Employee";
import Emp_protecter from "../components/employee/protect/Emp_protecter";
import Emp_jobs from "../pages/employees/jobs/Emp_jobs";
import UnconfirmedBookings from "../pages/employees/booking/Emp_Booking";
import Emp_BookingHistory from "../pages/employees/booking/Emp_BookingHistory";
import ChatList from "../pages/employees/chat/ChatListEmployeeside";
import Emp_forgotPass_otp from "../pages/employees/login/Emp_forgotPass_otp";
import Emp_forgotPass from "../pages/employees/login/Emp_forgotPass";
// import EmployeeChat from "../pages/employees/chat/Chatewindow";

const EmployeesRoutes = () => {
  return (
    <>
    <Routes>

    <Route path="forgot-password/otp" element={<Emp_forgotPass_otp/>}/>
    <Route path="forgot-password" element={<Emp_forgotPass/>}/>
    {/* <Route path="emp-chatt" element={<ChatWindow/>} /> */}

       
        <Route path="signup" element={
                    <Emp_protecter>

                      <EmployeeSignup/>
                    </Emp_protecter>

          }/>
        <Route path="home" element={
          <Emp_protecter>

            <Emp_Home/>
           </Emp_protecter> 
          }/>
        <Route path="login" element={
           <Emp_protecter>

             <Emp_Login/>
           </Emp_protecter>

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
          
<Emp_protecter>

  <UnconfirmedBookings/>
</Emp_protecter>
          }/>
        <Route path="booking-history" element={
          
<Emp_protecter>

  <Emp_BookingHistory/>
</Emp_protecter>
          }/>
        <Route path="*" element={<NotFound />} />
<Route path="chat" element={
  <Emp_protecter>

    <ChatList/>
  </Emp_protecter>

  } />
    </Routes>
      
    </>
  )
}

export default EmployeesRoutes
