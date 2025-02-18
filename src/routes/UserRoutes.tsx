
import { Routes,Route } from "react-router-dom"
import UserSignup from "../pages/clients/signup/UserSignup"
import Landingpage from "../pages/clients/Landing/Landingpage"
import UserLogin from "../pages/clients/login/UserLogin"
import UserHome from "../pages/clients/home/UserHome"
import NotFound from "../components/NotFound"
import UserProtect from "../components/client/Protect/UserProtect"
import UserProfile from "../pages/clients/profile/UserProfile"
import UserProfileEdit from "../pages/clients/profile/UserEditProfile"
import UsersideEmployees from "../pages/clients/employees/UsersideEmployees"
import Emp_Service_booking_progress from "../pages/clients/service-booking/Emp_Service_booking_progress"
import UserForgotPassword from "../pages/clients/login/UserForgotPassword"
import PasswordForm from "../pages/clients/login/NewPassword"
import ReqServiceWaiting from "../pages/clients/service-booking/Req_serviceWaiting"
import UserPayment from "../pages/clients/payment/UserPayment"
import PaymentSuccess from "../components/payments/SuccessPayment"
import PaymentFailed from "../components/payments/FailedPayment"
import UserBookingHistory from "../components/client/booking/UserBookingHistory"
import UserCurrentLocationMap from "../components/client/userMap/UserCurrentLocationMap"
import NearestEmployees from "../pages/clients/service-booking/NearestEmployees"
import RazorpayPaymentAdvance from "../pages/clients/payment/AdvancePay"
import UserBookingDetails from "../components/client/booking/UserBookingDetails"
import NoAvailableEmployees from "../components/client/unavailable/NoAvailableEmployees"
import UserChatList from "../pages/clients/userchat/UserChatlist"
import TransactionHistory from "../pages/clients/transactions/TransactionHistory"

const UserRoutes = () => {
  return (
    <>
    <Routes>

    <Route path="/signup" element={
       <UserProtect>

         <UserSignup/>
       </UserProtect>
      }/>
        <Route path="/"element={<Landingpage/>}/>
        <Route path="/login" element={

          <UserProtect>
            <UserLogin/>

          </UserProtect>

          } />
          
                    <Route path="forgot-password/otp" element={<UserForgotPassword/>}/>
                    <Route path="forgot-password" element={<PasswordForm/>}/>
                    
        <Route path="/home" element={
          <UserProtect>

            <UserHome/>
          </UserProtect>
          }/>
        <Route path="/change-location/:id" element={
          <UserProtect>

            <UserCurrentLocationMap/>
          </UserProtect>
          }/>
          <Route path="/profile" element={
            <UserProtect>
              <UserProfile/>
            </UserProtect>
          }/>
          <Route path="/profile/edit" element={
            <UserProtect>
              <UserProfileEdit/>
            </UserProtect>
          }/>
          <Route path="/employees" element={
            <UserProtect>
              <UsersideEmployees/>
            </UserProtect>
          }/>
          <Route path="/service-booking/prograss" element={
            <UserProtect>
              <Emp_Service_booking_progress/>
            </UserProtect>
          }/>
              <Route path="/req-service/waiting" element={
                <UserProtect>
                  <ReqServiceWaiting/>
                </UserProtect>
              }/>
              <Route path="/nearest-employees" element={
                <UserProtect>
                  <NearestEmployees/>
                </UserProtect>
              }/>
              <Route path="/advancepayment" element={
                <UserProtect>
                  <RazorpayPaymentAdvance/>
                </UserProtect>
              }/>

{/* 
<Route path="/map" element={<UserProtect>

  <UserMap />
</UserProtect> */}
  {/* }/> */}

<Route path="/payment" element={
   <UserProtect>

     <UserPayment/>
   </UserProtect>
     }/>
<Route path="/payment-success" element={
   <UserProtect>

     <PaymentSuccess/>
   </UserProtect>
     }/>
<Route path="/payment-failed" element={
  <UserProtect>

     <PaymentFailed/>
   </UserProtect>
     }/>
<Route path="/booking-history" element={
  <UserProtect>

     <UserBookingHistory/>
   </UserProtect>
     }/>
<Route path="/booking-history/details" element={
  <UserProtect>

     <UserBookingDetails/>
   </UserProtect>
     }/>
<Route path="/unavailable" element={
  <UserProtect>

     <NoAvailableEmployees/>
   </UserProtect>
     }/>
<Route path="/chat" element={
  <UserProtect>

     <UserChatList/>
   </UserProtect>
     }/>
     <Route path="/transactions" element={
       <UserProtect>
         <TransactionHistory/>
       </UserProtect>
     }/>

        <Route path="*" element={<NotFound />} />
    </Routes>




    

        


        </>
  )
}

export default UserRoutes