import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import {
  Cart,
  ChatListItem,
  Cords,
  ErrorPayload,
  Locationuser_types,
  Razorpay_Service_types,
  Request_Cart,
  Response_Razorpay_Service_types,
  Response_Req_service_employee_types,
  Response_ServiceBooking_History_types,
  Response_ServiceBooking_Types,
  ReviewRating_Types,
  SendReqService_employee_types,
  Service_Booking_Put_status_type,
  Service_Booking_Sendreq_EveryEmp,
  ServiceBooking_Types,
  ServicePayment_section,
  TransactonsTypes,
  User_Get_AllStores,
  UserEditProfile,
  UserImage_Types,
  UserLoginType,
  UserReport_FeedBack_types,
  UserSignUpTypes,
  UserStateTypes,
  UserSuccessResponseType,
} from "../../types/clients/UsersTypes";
import useraxiosInstance from "../../axios-api/Usersideapi";
import axios, { isAxiosError } from "axios";
import { CategoryStateTypes, JobsStateTypes } from "../../types/admin/admintypes";
import { EmployeeStateTypes, Response_ChatsTypes, WalletReq, WalletResponse } from "../../types/employee/EmployeeTypes";
import { Store_Product_types } from "../../types/storetypes";

export const userSignupPost = createAsyncThunk<
  UserStateTypes,
  UserSignUpTypes,
  { rejectValue: ErrorPayload }
>("user/signup", async (userData, { rejectWithValue }) => {
  try {
    console.log("userDate", userData);

    const response = await useraxiosInstance.post("/signup", userData);

    return response.data;
  } catch (error) {
    console.log(error);

    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.error || "An error occurred",
        status: error.response?.status,
        //   data: error.response?.data,
      });
    }
    // Handle unexpected errors
    return rejectWithValue({ message: "Something went wrong!" });
  }
});

export const UsersendOtpMail = createAsyncThunk<
  UserStateTypes,
  string,
  { rejectValue: ErrorPayload }
>("/user/signup/otp", async (otp, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post("/signup/otp", { otp });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.error || "An error occurred",
        status: error.response?.status,
      });
    }
    // Handle unexpected errors
    return rejectWithValue({ message: "Something went wrong!" });
  }
});

export const UserResendOtp = createAsyncThunk<
  string,
  UserSignUpTypes,
  { rejectValue: ErrorPayload }
>("user/signup/resendOtp", async (userData, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post(
      "/signup/resendOtp",
      userData
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.error || "An error occurred",
        status: error.response?.status,
        //   data: error.response?.data,
      });
    }
    return rejectWithValue({ message: "Something went wrong!" });
  }
});

export const userLoginPost = createAsyncThunk<
  UserSuccessResponseType,
  UserLoginType,
  { rejectValue: ErrorPayload }
>("user/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post("/login", userData);
    if (response.data && response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data.user));

      Cookies.set("userToken", response.data.token, {
        expires: 7, // Expires in 7 days
        path: "/",
        secure: true, // Use `true` only in HTTPS
      });
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.error || "an Error occured",
        status: error.response?.status,
      });
    }
    return rejectWithValue({ message: "something wrong" });
  }
});

export const UserGoogle_post = createAsyncThunk<
  UserSuccessResponseType,
    string,
    { rejectValue: ErrorPayload }
>("/user/google/login", async (credential: string, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post("/google", { credential });
    if (response.data && response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data.user));

      Cookies.set("userToken", response.data.token, {
        expires: 7, // Expires in 7 days
        path: "/",
        // secure: true, // Use `true` only in HTTPS
      });
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for google login",
    });
  }
});

export const User_get_Logout = createAsyncThunk<
  void,
  void,
  { rejectValue: ErrorPayload }
>("/user/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get("/logout");
    if (response.data) {
      localStorage.removeItem("user");
      Cookies.remove("userToken");
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
        status: error.response?.status,
      });
    }
    return rejectWithValue({
      message: "something error for user logout",
    });
  }
});

export const user_put_User_profile_pic = createAsyncThunk<
  UserStateTypes,
  UserImage_Types,
  { rejectValue: ErrorPayload }
>("/user/profile/editImage", async (userData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    console.log("Profile Picture:", userData.profile_pic);
    console.log("Received userData:", userData);

    if (userData.profile_pic) {
      formData.append("image", userData.profile_pic);
    }
    console.log("FormData Entries:");
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}:`, {
          name: pair[1].name,
          size: pair[1].size,
          type: pair[1].type,
        });
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    console.log("Profile Picture Type:", typeof userData.profile_pic);
    console.log("Profile Picture Value:", userData.profile_pic);

    const response = await useraxiosInstance.post(
      `/profile/image/${userData.id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (response.data) return response.data.user;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
        status: error.response?.status,
      });
    }
    return rejectWithValue({
      message: "something error for update user ",
    });
  }
});
export const user_put_Profile = createAsyncThunk<
  UserStateTypes,
  UserEditProfile,
  { rejectValue: ErrorPayload }
>(
  "/user/profile/edit",
  async (userData: UserEditProfile, { rejectWithValue }) => {
    try {
      console.log("User Data:", userData);

      // Log FormData contents

      // alert(formData)
      const response = await useraxiosInstance.put(
        `/profile/${userData.id}`,
        userData
      );
      if (response.data) return response.data.user;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data.error,
          status: error.response?.status,
        });
      }
      return rejectWithValue({
        message: "something error for update user ",
      });
    }
  }
);

export const User_get_allJobs = createAsyncThunk<
  JobsStateTypes[],
  void,
  { rejectValue: ErrorPayload }
>("/admin/getjobs", async (_, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get("/jobs");
    if (response.data) return response.data.jobs;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
        status: error.response?.status,
      });
    }
    return rejectWithValue({
      message: "something wrong geting jobs",
    });
  }
});

export const User_get_Employees = createAsyncThunk<
  EmployeeStateTypes[],
  void,
  { rejectValue: ErrorPayload }
>("/admin/getEmployees", async (_, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get("/employees");
    return response.data.employees;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
        status: error.response?.status,
      });
    }
    return rejectWithValue({
      message: "Something problem geting employees",
    });
  }
});

export const user_post_service_booking_send_every_Employee = createAsyncThunk<
  Response_Req_service_employee_types,
  Service_Booking_Sendreq_EveryEmp,
  { rejectValue: ErrorPayload }
>("/user/req/services", async (bookingData, { rejectWithValue }) => {
  try {
    console.log("service bookinh ", bookingData);

    const response = await useraxiosInstance.post("/req-services", bookingData);
    if (response.data) {
      localStorage.setItem(
        "reqService",
        JSON.stringify(response.data.reqService)
      );
      return response.data.reqService;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something wrong ...",
    });
  }
});

export const user_post_Service_Booking = createAsyncThunk<
  ServiceBooking_Types,
  ServiceBooking_Types,
  { rejectValue: ErrorPayload }
>("/user/service/post", async (bookingData, { rejectWithValue }) => {
  try {
    console.log("service bookinh ", bookingData);

    const response = await useraxiosInstance.post(
      "/service-booking",
      bookingData
    );
    if (response.data) {
      localStorage.setItem(
        "service-booking",
        JSON.stringify(response.data.service)
      );

      return response.data.service;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something wrong ...",
    });
  }
});

export const User_get_service_Booking = createAsyncThunk<
  ServiceBooking_Types,
  string,
  { rejectValue: ErrorPayload }
>("/user/service-booking/get", async (id, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get(`/service-booking/${id}`);
    if (response.data) {
      return response.data.service;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_post_Employee_feedBack = createAsyncThunk<
  UserReport_FeedBack_types,
  ReviewRating_Types,
  { rejectValue: ErrorPayload }
>("/user/report-feedback", async (feedBack, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post(`/report-feedBack`, feedBack);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_post_Forgot_password_OTP = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorPayload }
>("/user/forgot-password/otp", async (email, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post(`/forgot-password/otp`, {
      email,
    });
    if (response.data) {
      return response.data.email;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_post_forgot_password_otp_check = createAsyncThunk<
  void,
  string,
  { rejectValue: ErrorPayload }
>("/user/forgot-password/otp/check", async (otp, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post(`/forgot-password/check`, {
      otp,
    });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_post_forgot_password = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: ErrorPayload }
>("/user/forgot-password", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post(`/forgot-password`, {
      email,
      password,
    });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_get_reqService = createAsyncThunk<
  Response_Req_service_employee_types,
  string,
  { rejectValue: ErrorPayload }
>("/user/req-service/get", async (id, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get(`/req-service/${id}`);
    if (response.data) {
      return response.data.reqService;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_post_Razorpay = createAsyncThunk<
  Response_Razorpay_Service_types,
  Razorpay_Service_types,
  { rejectValue: ErrorPayload }
>("/user/service/payment/razorpay", async (payment, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post(
      `/service/payment/razorpay`,
      payment
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_post_confirm_Razorpay = createAsyncThunk<
  Response_Razorpay_Service_types,
  { id: string; payment: ServicePayment_section },
  { rejectValue: ErrorPayload }
>(
  "/user/service/payment/razorpay/confirm",
  async ({id,payment} ,{ rejectWithValue }) => {
    try {
      const response = await useraxiosInstance.post(
        `/service/payment/razorpay/confirm/${id}`,
        payment
      );
      if (response.data) {
        return response.data.servicepayment;
      }
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data.error,
        });
      }
      return rejectWithValue({
        message: "something error for getting service-booking",
      });
    }
  }
);

export const User_get_bookingHistories = createAsyncThunk<
  Response_Req_service_employee_types[],
  string,
  { rejectValue: ErrorPayload }
>("/user/service-booking/history", async (id, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get(`/booking-history/${id}`);
    if (response.data) {
      console.log("response history", response.data.history);

      return response.data.history;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_put_cancelReq_service = createAsyncThunk<
  Response_ServiceBooking_Types,
  Service_Booking_Put_status_type,
  { rejectValue: ErrorPayload }
>("/user/cancel/req-service", async (service, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.put(
      `/req-service/${service.id}`,
      service
    );
    if (response.data) {
      return response.data.service;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_get_servicePayment = createAsyncThunk<
  Response_ServiceBooking_History_types,
  string,
  { rejectValue: ErrorPayload }
>("/user/servicepayment/get", async (id, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get(`/service-payment/${id}`);
    if (response.data) {
      console.log("response history", response.data.service);

      return response.data.service;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_get_Allchat = createAsyncThunk<
  ChatListItem[],
  string,
  { rejectValue: ErrorPayload }
>("/user/chatlist/get", async (id, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get(`/chats-userId/${id}`);
    if (response.data) {
      console.log("response history", response.data.chats);

      return response.data.service;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_put_addLocation = createAsyncThunk<
  Locationuser_types,
  { id: string; location: Locationuser_types },
  { rejectValue: ErrorPayload }
>("/user/location/fetch", async ({ id, location }, { rejectWithValue }) => {
  console.log("location  req :       ", location);

  try {
    const response = await useraxiosInstance.put(`/location/${id}`, location);
    if (response.data) {
      return response.data.location;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});

export const User_get_findNearestEmployees = createAsyncThunk<
  EmployeeStateTypes[],
  Cords,
  { rejectValue: ErrorPayload }
>("/user/nearest/employee", async (location, { rejectWithValue }) => {
  console.log("location  req :       ", location);

  try {
    const response = await useraxiosInstance.get(`/nearest-employees`, {
      params: {
        lat: location.lat,
        lng: location.lng,
      },
    });
    if (response.data) {
      return response.data.employees;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});
export const User_put_sendOneEmpoloyee = createAsyncThunk<
  Response_Req_service_employee_types,
  SendReqService_employee_types,
  { rejectValue: ErrorPayload }
>("/user/reqservice/send/employee", async (service, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.put(
      `/nearest-employees/${service.serviceId}`,
      service
    );
    if (response.data) {
      return response.data.service
    }

// in case no data response
    return rejectWithValue({
      message: "No data found in response",
    });


  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error || "An error occurred while sending the request.",
      });
    }
    return rejectWithValue({
      message: "something error for getting service-booking",
    });
  }
});



export const User_post_advanceConfirm= createAsyncThunk<Response_Razorpay_Service_types,ServicePayment_section,{rejectValue:ErrorPayload}>(
  "/user/advance/confirmpay",
  async (payment,{rejectWithValue}) => {

    try {
      const response=await useraxiosInstance.post(`/advance-payment/confirm`,payment)
      if (response.data) {
        console.log("response history",response.data);

        return response.data

      }
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message:error.response?.data.error
        })

      }
      return rejectWithValue({
        message:"something error for getting service-booking"
      })

    }

  }
);

export const User_get_MessagesUserId= createAsyncThunk<

Response_ChatsTypes[],
string,
  { rejectValue: ErrorPayload }
>("/user/chats-get", async (userId, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get(
      `/chats-userId/${userId}`
    
    );
    if (response.data) {
      return response.data.chats;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something wrong in geting chats ",
    });
  }
});

export const user_get_EmployeeDetails= createAsyncThunk<

EmployeeStateTypes,
string,
  { rejectValue: ErrorPayload }
>("/user/get/employeeDetails", async (empId, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get(
      `/employee/${empId}`
    
    );
    if (response.data) {
      return response.data.user;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something wrong in geting chats ",
    });
  }
});



export const user_get_walletdetails= createAsyncThunk<

WalletResponse,
WalletReq,
  { rejectValue: ErrorPayload }
>("/user/get/walletDetails", async (wallet, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get(
      `/wallet/userId/${wallet.userId}`
    
    );
    if (response.data) {
      return response.data.wallet;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something wrong in geting chats ",
    });
  }
});

export const user_post_reportrefund= createAsyncThunk<

ReviewRating_Types,
ReviewRating_Types  ,
  { rejectValue: ErrorPayload }
>("/user/post/report", async (report, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post(
      `/report`,report
    
    );
    if (response.data) {
      return response.data.report;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something wrong in geting chats ",
    });
  }
});

export const user_get_Transactionhistory= createAsyncThunk<

TransactonsTypes[] ,
string,
  { rejectValue: ErrorPayload }
>("/user/get/transactions", async (userid, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.get(
      `/transactions/${userid}`,
    
    );
    if (response.data) {
      return response.data.transactions;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something wrong in geting chats ",
    });
  }
});





export const User_get_20kmstores=createAsyncThunk<User_Get_AllStores[],Locationuser_types,{rejectValue:ErrorPayload}>('/user/get20kmstores',async(location,{rejectWithValue})=>{
  try {
    const response=await useraxiosInstance.get('/stores',{
      params: {
        lat: location.lat,
        lng: location.lng,
      },
    })
    if(response.data){
      console.log("stores",response.data);
      
      return response.data.stores
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


export const User_get_allCategories=createAsyncThunk<CategoryStateTypes[],void,{rejectValue:ErrorPayload}>('/user/getcategroires',async(_,{rejectWithValue})=>{
  try {
    const response=await useraxiosInstance.get('/categories')
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



export const User_get_allProduct=createAsyncThunk<Store_Product_types[],void,{rejectValue:ErrorPayload}>('/user/getprodut',async(_,{rejectWithValue})=>{
  try {
    const response=await useraxiosInstance.get('/products')
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



export const User_get_allProductwithStoreId=createAsyncThunk<Store_Product_types[],string,{rejectValue:ErrorPayload}>('/user/getproductStoreId',async(storeId,{rejectWithValue})=>{
  try {
    const response=await useraxiosInstance.get(`/products/${storeId}`)
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



export const User_post_addtoCart=createAsyncThunk<Cart,Request_Cart,{rejectValue:ErrorPayload}>('/user/addtoCart',async(cart,{rejectWithValue})=>{
  try {
    const response=await useraxiosInstance.post(`/cart`,cart)
    if(response.data)return response.data.cart
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



export const User_put_addtoCart=createAsyncThunk<Cart,Request_Cart,{rejectValue:ErrorPayload}>('/user/addtoCart',async(cart,{rejectWithValue})=>{
  try {
    const response=await useraxiosInstance.put(`/cart/${cart.id}`,cart)
    if(response.data)return response.data.cart
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


export const User_get_CartnyUserId=createAsyncThunk<Cart[],string,{rejectValue:ErrorPayload}>('/user/getcartUserId',async(userId,{rejectWithValue})=>{
  try {
    const response=await useraxiosInstance.get(`/cart-user/${userId}`)


    if(response.data){
      console.log(response.data.cart);
      console.log(response.data);
      
      return response.data.cart}
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


export const User_get_CartbyProductId=createAsyncThunk<Cart|boolean,string,{rejectValue:ErrorPayload}>('/user/getcartproductId',async(productId,{rejectWithValue})=>{
  try {
    const response=await useraxiosInstance.get(`/cart-product/${productId}`)
    if(response.data)return response.data.cart
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



export const User_removeFromCart=createAsyncThunk<void,string,{rejectValue:ErrorPayload}>('/user/removeCart',async(cartId,{rejectWithValue})=>{
  try {
    const response=await useraxiosInstance.delete(`/cart/${cartId}`)
    if(response.data)return response.data
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

