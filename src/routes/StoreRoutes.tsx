import { Routes,Route } from "react-router-dom";
import StoreRegistrationPage from "../pages/autopartsstores/register/Storeregister";

const StoreRoutes = () => {
  return (
    <>
    <Routes>
        <Route path="register"  element={<StoreRegistrationPage/>}/>
    </Routes>
    
    
    </>
  )
}

export default StoreRoutes