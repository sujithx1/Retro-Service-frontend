import { createAsyncThunk } from "@reduxjs/toolkit";
import { Store_Product_types, Store_types, storeRegister_types, StoreSuccessResponseType } from "../../types/storetypes";
import storeApiInstance from "../../axios-api/storesideapi";
import { isAxiosError } from "axios";
import { ErrorPayload, Locationuser_types, User_orderEdit_types, User_OrderHistorytypes } from "../../types/clients/UsersTypes";
import Cookies from "js-cookie";
import { CategoryStateTypes } from "../../types/admin/admintypes";


export const StoreRegister=createAsyncThunk<Store_types|void,storeRegister_types,{ rejectValue: ErrorPayload }>('/store/register',async(storeData,{rejectWithValue})=>{

    try {
        const response=await storeApiInstance.post('/register',storeData)
        if (response.data) {
            return response.data.storeOwner
            
        }
    } catch (error) {
        if(isAxiosError(error))
        {
            return rejectWithValue({
                message:error.response?.data.error
            })
        }
        return rejectWithValue({
            message:'something error accured'
        })
        
    }

})

export const StoreSendMailotp = createAsyncThunk<
  Store_types,
  string,
  { rejectValue: ErrorPayload }
>("/store/signup/otp", async (otp, { rejectWithValue }) => {
  try {
    const response = await storeApiInstance.post("/otp", { otp });
    return response.data.store;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.error || "An error occurred",
        status: error.response?.status,
      });
    }
    // Handle unexpected errors
    return rejectWithValue({ message: "Something went wrong!" });
  }
});

export const storeResendOtp = createAsyncThunk<
  string,
  storeRegister_types,
  { rejectValue: ErrorPayload }
>("store/signup/resendOtp", async (userData, { rejectWithValue }) => {
  try {
    const response = await storeApiInstance.put(
      "/otp",
      userData
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.error || "An error occurred",
        status: error.response?.status,
        //   data: error.response?.data,
      });
    }
    return rejectWithValue({ message: "Something went wrong!" });
  }
});

export const storeLoginPost = createAsyncThunk<
StoreSuccessResponseType,
  {storeId:string;password:string},
  { rejectValue: ErrorPayload }
>("store/login", async (storeData, { rejectWithValue }) => {
  try {
    const response = await storeApiInstance.post("/login", storeData);
    if (response.data && response.data.token) {
      console.log(response.data);
      localStorage.setItem("store", JSON.stringify(response.data.store));
      
      console.log("local storage "+localStorage.getItem('store'));
      
      Cookies.set("storeToken", response.data.token, {
        expires: 7, // Expires in 7 days
        path: "/",
        secure: true, // Use `true` only in HTTPS
      });
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.error || "an Error occured",
        status: error.response?.status,
      });
    }
    return rejectWithValue({ message: "something wrong" });
  }
});





export const Store_get_allCategories=createAsyncThunk<CategoryStateTypes[],void,{rejectValue:ErrorPayload}>('/store/getcategroires',async(_,{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.get('/categories')
    if(response.data)return response.data.categories
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }
})




export const Store_add_Product=createAsyncThunk<Store_Product_types,Store_Product_types,{rejectValue:ErrorPayload}>('/store/addproduct',async(productData,{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.post('/product',productData)
    if(response.data)return response.data.product
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})




export const Store_getAll_Product=createAsyncThunk<Store_Product_types[],void,{rejectValue:ErrorPayload}>('/store/getproduct',async(_,{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.get('/products')
    if(response.data)return response.data.products
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})

export const Store_getAll_ProductWithstoreId=createAsyncThunk<Store_Product_types[],string,{rejectValue:ErrorPayload}>('/store/getproductstoreId',async(storeId,{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.get(`/products/${storeId}`)
    if(response.data)return response.data.products
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})



export const Store_put_Location=createAsyncThunk<Locationuser_types,{id:string,location:Locationuser_types},{rejectValue:ErrorPayload}>('/store/locationset',async({id,location},{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.put(`/location/${id}`,location)
    if(response.data)return response.data.location
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})



export const Store_logout=createAsyncThunk<void,void,{rejectValue:ErrorPayload}>('/store/logout',async(_,{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.get(`/logout`)
    if(response.data){
      localStorage.removeItem("store");
      Cookies.remove("storeToken");
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})

export const Store_get_Product=createAsyncThunk<Store_Product_types,string,{rejectValue:ErrorPayload}>('/store/getproduct',async(id,{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.get(`/product/${id}`)
    if(response.data){
      return response.data.product
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})



export const Store_update_Product=createAsyncThunk<Store_Product_types,Store_Product_types,{rejectValue:ErrorPayload}>('/store/editproduct',async(product,{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.put(`/product/${product.id}`,product)
    if(response.data){
      return response.data.product
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})





export const Store_get_oreders=createAsyncThunk<User_OrderHistorytypes[],string,{rejectValue:ErrorPayload}>('/store/orders',async(storeId,{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.get(`/orders/${storeId}`)
    if(response.data){
      return response.data.orders
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})



export const Store_put_oreder=createAsyncThunk<User_OrderHistorytypes,User_orderEdit_types,{rejectValue:ErrorPayload}>('/store/order/edit',async(order,{rejectWithValue})=>{
  try {
    const response=await storeApiInstance.put(`/order/${order.orderId}`,order)
    if(response.data){
      return response.data.order
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})


