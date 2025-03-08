import { Routes,Route } from "react-router-dom";
import StoreRegistrationPage from "../pages/autopartsstores/register/Storeregister";
import NotFound from "../components/NotFound";
import StoreLogin from "../pages/autopartsstores/login/storeLogin";
import StoreHome from "../pages/autopartsstores/home/Storehome";
import ProductList from "../pages/autopartsstores/Products/Products";
import AddProduct from "../components/store_side/Addproduct";
import StoreProtect from "../components/store_side/Protect";
import EditProduct from "../components/store_side/product/EditProduct";
import StoreCurrentLocation from "../components/store_side/map/Storelocation";
import StoreOrders from "../pages/autopartsstores/orders/Orders_storeSide";

const StoreRoutes = () => {
  return (
    <>
    <Routes>
        <Route path="register"  element={<StoreRegistrationPage/>}/>
        <Route path="login"  element={<StoreLogin/>}/>
        <Route path="home"  element={
          <StoreProtect>

            <StoreHome/>
          </StoreProtect>
          }/>
        <Route path="products"  element={<StoreProtect>

          <ProductList/>
        </StoreProtect>
          }/>
        <Route path="add-product"  element={
          <StoreProtect>
            <AddProduct/>

          </StoreProtect>
          }/>
        <Route path="edit-product/:id"  element={
          <StoreProtect>
            <EditProduct/>

          </StoreProtect>
          }/>
        <Route path="change-location/:id"  element={
          <StoreProtect>
            <StoreCurrentLocation/>

          </StoreProtect>
          }/>
        <Route path="orders"  element={
          <StoreProtect>
            <StoreOrders/>

          </StoreProtect>
          }/>

        <Route path="*" element={<NotFound/>} />

    </Routes>
    
    
    </>
  )
}

export default StoreRoutes