import { Route, Routes } from "react-router-dom"
import AdminLogin from "../pages/admin/login/AdminLogin"
import AdminHome from "../pages/admin/home/AdminHome"
import AdminWorkersTable from "../pages/admin/workers/Workers"
import NotFound from "../components/NotFound"
import Admin_Categories from "../pages/admin/categories/Admin_Categories"
import UsersManagement from "../pages/admin/users/UsersManagement"
import Admin_joblist from "../pages/admin/jobs/Admin_joblist"
import Protect from "../components/admin/protector/Protect"
import AdminReportFeedbackList from "../pages/admin/report-feedback/Report-FeedBack"

const AdminRoutes = () => {
  return (
    
    <>
    
    <Routes>

    <Route path="login" element={<AdminLogin/>}/>
        <Route path="" element={
          <Protect>

            <AdminHome/>
        </Protect>
          }/>
        

        <Route path="mechanics" element={
          <Protect>
            <AdminWorkersTable/>
     </Protect>
            }/>
            <Route path="users" element={
              <Protect>

                <UsersManagement/>
              </Protect>
              }/>
        {/* <Route path="autospareparts" element={<Admin_spare_partslist/>}/> */}
        <Route path="categories" element={
          <Protect>

            <Admin_Categories/>
          </Protect>
          }/>
        <Route path="jobs" element={
          <Protect>

            <Admin_joblist/>
          </Protect>
          }/>
        <Route path="report-feedback" element={
          <Protect>

            <AdminReportFeedbackList/>
          </Protect>
          }/>
        <Route path="*" element={<NotFound />} />
        


    </Routes>
    
    </>
  )
}

export default AdminRoutes