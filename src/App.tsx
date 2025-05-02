
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
import AudioPlayer from "./pages/clients/userchat/audioplayer"

function App() {

 


  return (
    <>
  
    

    <Router>
    <Routes>
      
        
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/employee/*" element={<EmployeesRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes/>} />
        <Route path="/store/*" element={<StoreRoutes/>} />
        <Route path="/audio" element={<AudioPlayer audioUrl="https://res.cloudinary.com/ded1lrbaz/video/upload/v1743248023/uploads/cuay4i4abvka5qavlzdd.webm"/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      
      
        
        
      


      
    </Router>

    
    <ToastContainer/>

 
    </>
  )
}

export default App
