import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  
  FinduserLocation,
  Response_Req_service_employee_types,
  ServiceBooking_Types,
  UserInitialState,
  UserSignUpTypes,
  UserStateTypes,
} from "../../types/clients/UsersTypes";
import {
  User_get_Allchat,
  User_get_allJobs,
  User_get_bookingHistories,
  User_get_Employees,
  User_get_Logout,
  User_get_reqService,
  User_get_service_Booking,
  User_get_servicePayment,
  User_post_confirm_Razorpay,
  User_post_Employee_feedBack,
  User_post_forgot_password,
  User_post_Forgot_password_OTP,
  
  user_post_Service_Booking,
  user_post_service_booking_send_every_Employee,
  User_put_addLocation,
  User_put_cancelReq_service,
  user_put_Profile,
  user_put_User_profile_pic,
  UserGoogle_post,
  userLoginPost,
  UserResendOtp,
  UsersendOtpMail,
  userSignupPost,
} from "./UserapiCalls";
import {
  Emp_Location_Types,
  EmployeeStateTypes,
} from "../../types/employee/EmployeeTypes";
import { JobsStateTypes } from "../../types/admin/admintypes";

const tempuser: UserSignUpTypes = {
  username: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
};
const selectEmp: Emp_Location_Types = {
  id: "",
  username: "",
  email: "",
  location: "",
  userLocation: "",
  lat: 0,
  lng: 0,
  userId:""
};
const serviceBooking: ServiceBooking_Types = {
  id: "",
  userId: "",
  userName: "",
  userEmail: "",
  problem: "",
  userLocation: "",
  employeeId: "",
  employeeName: "",
  empLocation: "",
  jobId: "",
  jobName: "",
  ServiceMin_wage: 0,
  status: "",
};

// const reqserviceBooking:Response_Req_service_employee_types={
//   userId:"",
//   userEmail:"",
//   userName:"",
//   userLocation:{
//     lat:0,
//     lng:0,
//     address:""
//   },
//   jobId:"",
//   jobName:'',
//   problem:"",
//   minWage:0,
//   mechanics:[], 
//   acceptEmployee:{
//     employeeId:"",
//     acceptTime:null


//   } 
//   ,
//   status:""


// }
const selectLocation:FinduserLocation={
  lat:0,
  lng:0,
  address:""

}
const employees: EmployeeStateTypes[] = [];
const jobs: JobsStateTypes[] = [];

const user = localStorage.getItem("user")? JSON.parse(localStorage.getItem("user") as string): null;
  const savedReqService = localStorage.getItem('reqService')?JSON.parse(localStorage.getItem('reqService') as string):null

const initialState: UserInitialState = {
  user: user ? user : null,
  selectEmp,
  serviceBooking,
  reqService:savedReqService, 
  bookingHistories:[],
  employee: employees ? employees : [],
  jobs: jobs ? jobs : [],
  tempuser,
  selectLocationuser:selectLocation,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

const userSlices = createSlice({
  name: "User",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearUser: (state) => {
      state.user = null;
    },
    saveEmail: (state, action) => {
      state.tempuser.email = action.payload;
    },
    setTempuser: (state, action) => {
      const newuser: UserSignUpTypes = action.payload;
      console.log("temporrey user", newuser);

      state.tempuser = newuser;
    },
    clearTempuser: (state) => {
      state.tempuser = tempuser;
    },
    selectEmployee: (state, action) => {
      state.selectEmp = action.payload;
    },
    setuserSelectLocation:(state,action)=>{
      state.selectLocationuser=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignupPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userSignupPost.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(userSignupPost.rejected, (state, action) => {
        console.log("extra reducer error payload ", action.payload);

        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
        state.user = null;
      })
      .addCase(UsersendOtpMail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        UsersendOtpMail.fulfilled,
        (state, action: PayloadAction<UserStateTypes>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          console.log(action.payload);

          state.user = action.payload;
          // localStorage.setItem("user",JSON.stringify(state.user))
        }
      )
      .addCase(UsersendOtpMail.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
        state.user = null;
      })
      .addCase(UserResendOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UserResendOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        // state.isSuccess=true
      })
      .addCase(UserResendOtp.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;

        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
        state.user = null;
      })
      .addCase(userLoginPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userLoginPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload.user;
        console.log("after login user ", user);
      })
      .addCase(userLoginPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
        state.user = null;
      })

      .addCase(UserGoogle_post.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UserGoogle_post.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        // cookies.set('userToken',action.payload.token,{path:'/',maxAge:7 * 24 * 60 * 60})
      })
      .addCase(UserGoogle_post.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })

      .addCase(User_get_Logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_get_Logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(User_get_Logout.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
      .addCase(user_put_Profile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(user_put_Profile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(user_put_Profile.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(user_put_User_profile_pic.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(user_put_User_profile_pic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(user_put_User_profile_pic.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(User_get_allJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        User_get_allJobs.fulfilled,
        (state, action: PayloadAction<JobsStateTypes[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.jobs = action.payload;
          localStorage.removeItem("service-booking");
        }
      )
      .addCase(User_get_allJobs.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(User_get_Employees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        User_get_Employees.fulfilled,
        (state, action: PayloadAction<EmployeeStateTypes[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.employee = action.payload;
        }
      )
      .addCase(User_get_Employees.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(user_post_Service_Booking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        user_post_Service_Booking.fulfilled,
        (state, action: PayloadAction<ServiceBooking_Types>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.serviceBooking = action.payload;
        }
      )
      .addCase(user_post_Service_Booking.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(User_get_service_Booking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        User_get_service_Booking.fulfilled,
        (state, action: PayloadAction<ServiceBooking_Types>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.serviceBooking = action.payload;
        }
      )
      .addCase(User_get_service_Booking.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(User_post_Employee_feedBack.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_post_Employee_feedBack.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(User_post_Employee_feedBack.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(User_post_Forgot_password_OTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_post_Forgot_password_OTP.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(User_post_Forgot_password_OTP.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
      .addCase(User_post_forgot_password.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_post_forgot_password.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(User_post_forgot_password.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
     
      .addCase(user_post_service_booking_send_every_Employee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(user_post_service_booking_send_every_Employee.fulfilled, (state,action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reqService=action.payload
      })
      .addCase(user_post_service_booking_send_every_Employee.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
      .addCase(User_get_reqService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_get_reqService.fulfilled, (state,action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log("action",action.payload);
        

      if (action.payload.status=="CONFIRMED") {

        
        state.reqService=action.payload
      }
      })
      .addCase(User_get_reqService.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
     
      .addCase(User_post_confirm_Razorpay.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_post_confirm_Razorpay.fulfilled, (state,action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log("action",action.payload);
        

      })
      .addCase(User_post_confirm_Razorpay.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
      .addCase(User_get_bookingHistories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_get_bookingHistories.fulfilled, (state,action:PayloadAction<Response_Req_service_employee_types[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log("action",action.payload);
        const newDatas:Response_Req_service_employee_types[]=action.payload.sort((a,b)=>new Date(b.bookingDate||"").getTime()-new Date(a.bookingDate||"").getTime())
        console.log("sorted",newDatas);
        
        state.bookingHistories=newDatas
        

      })
      .addCase(User_get_bookingHistories.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
      .addCase(User_put_cancelReq_service.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_put_cancelReq_service.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // console.log("action",action.payload);
        // state.bookingHistories=action.payload
        

      })
      .addCase(User_put_cancelReq_service.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
      .addCase(User_get_servicePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_get_servicePayment.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // console.log("action",action.payload);
        // state.bookingHistories=action.payload
        

      })
      .addCase(User_get_servicePayment.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
      .addCase(User_get_Allchat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_get_Allchat.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // console.log("action",action.payload);
        // state.bookingHistories=action.payload
        

      })
      .addCase(User_get_Allchat.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
      .addCase(User_put_addLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(User_put_addLocation.fulfilled, (state,action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log("userlocation");
        
        if (state.user) {
          state.user.location=action.payload
          
        }
        // console.log("action",action.payload);
        // state.bookingHistories=action.payload
        

      })
      .addCase(User_put_addLocation.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
  },
});

export const {
  reset,
  clearUser,
  setTempuser,
  clearTempuser,
  selectEmployee,
  saveEmail,
  setuserSelectLocation
  
} = userSlices.actions;
export default userSlices.reducer;
