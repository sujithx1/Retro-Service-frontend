
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

const UserRoutes = () => {
  return (
    <>
    <Routes>

    <Route path="/signup" element={
      <UserSignup/>
      }/>
        <Route path="/"element={<Landingpage/>}/>
        <Route path="/login" element={

            <UserLogin/>
            } />
        <Route path="/home" element={
          <UserProtect>

            <UserHome/>
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
{/* 
<Route path="/map" element={<UserProtect>

  <UserMap />
</UserProtect> */}
  {/* }/> */}


        <Route path="*" element={<NotFound />} />
    </Routes>




    

        


        </>
  )
}

export default UserRoutes