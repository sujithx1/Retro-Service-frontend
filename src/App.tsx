
import {  Route, BrowserRouter as Router, Routes } from "react-router-dom"
import "./App.css"
import "bootstrap/dist/css/bootstrap.css"
import { ToastContainer} from "react-toastify"
import "react-toastify/ReactToastify.css"
import AdminRoutes from "./routes/AdminRoutes"
import UserRoutes from "./routes/UserRoutes"
import EmployeesRoutes from "./routes/EmployeesRoutes"
import NotFound from "./components/NotFound"
import StoreRoutes from "./routes/StoreRoutes"
// import LocalMeet from "./routes/videocall"

function App() {
  
  


  return (
    <>
    
    

    <Router>
    <Routes>
      
        
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/employee/*" element={<EmployeesRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes/>} />
        <Route path="/store/*" element={<StoreRoutes/>} />
        {/* <Route path="/localCall" element={<LocalMeet/>} /> */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
      s
      
        
        
     


      
    </Router>

    
    <ToastContainer/>

 
    </>
  )
}

export default App
