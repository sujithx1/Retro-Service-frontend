
import {  Route, BrowserRouter as Router, Routes } from "react-router-dom"
import "./App.css"
import "bootstrap/dist/css/bootstrap.css"
import { ToastContainer} from "react-toastify"
import "react-toastify/ReactToastify.css"
import AdminRoutes from "./routes/AdminRoutes"
import UserRoutes from "./routes/UserRoutes"
import EmployeesRoutes from "./routes/EmployeesRoutes"
import NotFound from "./components/NotFound"

// import ChatHome from "./pages/employees/chat/Emp_chat"

function App() {

  


  return (
    <>
    
   

    <Router>
    <Routes>
        {/* <Route path="/chatt" element={ <div className="flex h-screen">
      <ChatHome /> */}
      {/* <ChatWindow /> */}
    {/* </div>} /> */}

        
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/employee/*" element={<EmployeesRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path="*" element={<NotFound/>} />
      </Routes>
      
      
        
        
     


      
    </Router>
    
    <ToastContainer/>
 
    </>
  )
}

export default App
