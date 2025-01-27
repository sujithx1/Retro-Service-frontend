import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Emp_Put_job,
  Employee_EditProfile_types,
  EmployeeSignUpTypes,
  EmployeeStateTypes,
  Response_ChatsTypes,
} from "../../types/employee/EmployeeTypes";
import {
  ErrorPayload,
  req_service_accept_types,
  Response_Req_service_employee_types,
  Response_ServiceBooking_History_types,
  Response_ServiceBooking_Types,
  Service_Booking_Put_status_type,
  
  UserLoginType,
  UserStateTypes,
} from "../../types/clients/UsersTypes";
import { employee_Axios_instance } from "../../axios-api/employee.api";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import { JobsStateTypes } from "../../types/admin/admintypes";
export const employee_signup_post = createAsyncThunk<
  EmployeeStateTypes,
  EmployeeSignUpTypes,
  { rejectValue: ErrorPayload }
>("/employee/signup", async (employeData, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.post("/signup", employeData);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error || "signup error",
        status: error.response?.status,
      });
    }
    return rejectWithValue({ message: "Something problem for signup" });
  }
});

export const Employee_Send_otp = createAsyncThunk<
  EmployeeStateTypes,
  string,
  { rejectValue: ErrorPayload }
>("/signup/otp", async (otp, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.post("/signup/otp", { otp });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
        status: error.response?.status,
      });
    }
    return rejectWithValue({
      message: "otp not sending something problem",
    });
  }
});

export const employee_resend_otp = createAsyncThunk<
  string,
  EmployeeSignUpTypes,
  { rejectValue: ErrorPayload }
>("/signup/resend", async (employeData, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.post(
      "/signup/resendotp",
      employeData
    );
    if (response.data) return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
        status: error.response?.status,
      });
    }
  }
});

export const Emp_login_post = createAsyncThunk<
  EmployeeStateTypes,
  UserLoginType,
  { rejectValue: ErrorPayload }
>("/employee/login", async (employeeData, { rejectWithValue }) => {
  console.log("login post");

  try {
    const response = await employee_Axios_instance.post("/login", employeeData);
    console.log(response);

    if (response.data && response.data.token) {
      localStorage.setItem("employee", JSON.stringify(response.data.employee));

      Cookies.set("employeeToken", response.data.token, {
        expires: 7, // Expires in 7 days
        path: "/",
        secure: true, // Use `true` only in HTTPS
      });
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
        status: error.response?.status,
      });
    }
    return rejectWithValue({
      message: "Somthing problem for Employee Login",
    });
  }
});

export const Employee_put_Profile = createAsyncThunk<
  EmployeeStateTypes,
  Employee_EditProfile_types,
  { rejectValue: ErrorPayload }
>(
  "/employee/profile/edit",
  async (employeData: Employee_EditProfile_types, { rejectWithValue }) => {
    try {
      console.log("User Data:", employeData);

      // Log FormData contents

      // alert(formData)
      const response = await employee_Axios_instance.put(
        `/profile/${employeData.id}`,
        employeData
      );
      if (response.data) return response.data.employee;
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

export const Employee_get_Logout = createAsyncThunk<
  void,
  void,
  { rejectValue: ErrorPayload }
>("/employee/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.get("/logout");
    if (response.data) {
      localStorage.removeItem("employee");
      Cookies.remove("employeeToken");
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

export const Employee_put_jobs = createAsyncThunk<
  EmployeeStateTypes,
  Emp_Put_job,
  { rejectValue: ErrorPayload }
>("/employee/job/put", async (empData, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.put(
      `/job/${empData.empId}`,
      empData
    );
    if (response.data) {
      return response.data.employee;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data.error,
      });
    }
    return rejectWithValue({
      message: "something error for add jobs from empl",
    });
  }
});

export const Employee_get_Service_Booking = createAsyncThunk<
  Response_ServiceBooking_Types[],
  string,
  { rejectValue: ErrorPayload }
>("/employee/service-booking", async (employeeId, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.get(
      `/service-booking/${employeeId}`
    );

    if (response.data) {
      console.log("get service-booking employees", response.data);

      return response.data.services;
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

export const employee_put_ServiceBooking = createAsyncThunk<
  Response_ServiceBooking_Types,
  Service_Booking_Put_status_type,
  { rejectValue: ErrorPayload }
>("/employee/service-booking/modify", async (Service, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.put(
      `/service-booking/status/${Service.id}`,
      { status: Service.status }
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
      message: "something wrong in modify service booking in employee",
    });
  }
});


export const employee_get_allJobs=createAsyncThunk<JobsStateTypes[],void,{rejectValue:ErrorPayload}>('/employee/getjobs',async(_,{rejectWithValue})=>{
  try {
    console.log("get jobs");
    
    const response=await employee_Axios_instance.get('/jobs')
    if(response.data)return response.data.jobs
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting jobs"
    })
    
  }
})



export const employee_get_details=createAsyncThunk<EmployeeStateTypes,string,{rejectValue:ErrorPayload}>('/employee/details',async(id,{rejectWithValue})=>{
  try {
    const response=await employee_Axios_instance.get(`/employee/${id}`)
    if (response.data) {
      return response.data.employee
      
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error

        
      })
      
      
    }
    return rejectWithValue({
    message:'something problem getting employee details'
    })
    
  }

})


export const employee_get_reqServices=createAsyncThunk<Response_Req_service_employee_types[],string,{rejectValue:ErrorPayload}>('/employee/reqServices',async(id,{rejectWithValue})=>{
  try {
    const response=await employee_Axios_instance.get(`/req-services/${id}`)
    if (response.data) {
      return response.data.reqService
      
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error

        
      })
      
      
    }
    return rejectWithValue({
    message:'something problem getting employee details'
    })
    
  }

})


export const employee_put_accept_service= createAsyncThunk<
  Response_Req_service_employee_types,
  req_service_accept_types,
  { rejectValue: ErrorPayload }
>("/employee/service-booking/modify", async (Service, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.put(
      `/req-serivce/acceptemployee/${Service.id}`,
      Service
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
      message: "something wrong in modify service booking in employee",
    });
  }
});


export const employee_get_payment_service= createAsyncThunk<

Response_ServiceBooking_History_types,
string,
  { rejectValue: ErrorPayload }
>("/employee/service-payment-get", async (paymentId, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.get(
      `/service-payment/${paymentId}`
    
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
      message: "something wrong in modify service booking in employee",
    });
  }
});

export const employee_get_MessagesemployeeId= createAsyncThunk<

Response_ChatsTypes[],
string,
  { rejectValue: ErrorPayload }
>("/employee/chats-get", async (employeeid, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.get(
      `/chats-employeeid/${employeeid}`
    
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
export const employee_get_UserDetails= createAsyncThunk<

UserStateTypes,
string,
  { rejectValue: ErrorPayload }
>("/employee/get/userdetails", async (userId, { rejectWithValue }) => {
  try {
    const response = await employee_Axios_instance.get(
      `/user/${userId}`
    
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




export const Emp_post_Forgot_password_OTP= createAsyncThunk<string,string,{rejectValue:ErrorPayload}>(
  "/employee/forgot-password/otp",
  async (email,{rejectWithValue}) => {

    try {
      const response=await employee_Axios_instance.post(`/forgot-password/otp`,{email})
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



export const Employee_post_forgot_password_otp_check= createAsyncThunk<void,string,{rejectValue:ErrorPayload}>(
  "/employee/forgot-password/otp/check",
  async (otp,{rejectWithValue}) => {

    try {
      const response=await employee_Axios_instance.post(`/forgot-password/check`,{otp})
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




export const Employee_post_forgot_password= createAsyncThunk<void, { email: string; password: string }  ,{rejectValue:ErrorPayload}>(
  "/user/forgot-password",
  async ({email,password},{rejectWithValue}) => {

    try {
      const response=await employee_Axios_instance.post(`/forgot-password`,{email,password})
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


