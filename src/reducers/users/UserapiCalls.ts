import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import {
  ErrorPayload,  
  Service_Booking_Sendreq_EveryEmp,
  ServiceBooking_Types,
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
import { JobsStateTypes } from "../../types/admin/admintypes";
import { EmployeeStateTypes } from "../../types/employee/EmployeeTypes";

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
  void,
  Service_Booking_Sendreq_EveryEmp,
  { rejectValue: ErrorPayload }
>("/user/service/post", async (bookingData, { rejectWithValue }) => {
  try {
    console.log("service bookinh ", bookingData);

    const response = await useraxiosInstance.post(
      "/req-services",
      bookingData
    );
    if (response.data) {
     
      return response.data.service



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
      localStorage.setItem('service-booking',JSON.stringify(response.data.service))
     
      return response.data.service



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

export const User_get_service_Booking = createAsyncThunk<ServiceBooking_Types,string,{rejectValue:ErrorPayload}>(
  "/user/service-booking/get",
  async (id,{rejectWithValue}) => {

    try {
      const response=await useraxiosInstance.get(`/service-booking/${id}`)
      if (response.data) {
        return response.data.service
        
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

export const User_post_Employee_feedBack = createAsyncThunk<UserReport_FeedBack_types,UserReport_FeedBack_types,{rejectValue:ErrorPayload}>(
  "/user/report-feedback",
  async (feedBack,{rejectWithValue}) => {

    try {
      const response=await useraxiosInstance.post(`/report-feedBack`,feedBack)
      if (response.data) {
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


export const User_post_Forgot_password_OTP= createAsyncThunk<string,string,{rejectValue:ErrorPayload}>(
  "/user/forgot-password/otp",
  async (email,{rejectWithValue}) => {

    try {
      const response=await useraxiosInstance.post(`/forgot-password/otp`,{email})
      if (response.data) {
        return response.data.email
        
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



export const User_post_forgot_password_otp_check= createAsyncThunk<void,string,{rejectValue:ErrorPayload}>(
  "/user/forgot-password/otp/check",
  async (otp,{rejectWithValue}) => {

    try {
      const response=await useraxiosInstance.post(`/forgot-password/check`,{otp})
      if (response.data) {
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








export const User_post_forgot_password= createAsyncThunk<void, { email: string; password: string }  ,{rejectValue:ErrorPayload}>(
  "/user/forgot-password",
  async ({email,password},{rejectWithValue}) => {

    try {
      const response=await useraxiosInstance.post(`/forgot-password`,{email,password})
      if (response.data) {
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







