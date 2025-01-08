import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Employee_InitialState,
  EmployeeSignUpTypes,
} from "../../types/employee/EmployeeTypes";
import {
  Emp_login_post,
  employee_get_allJobs,
  employee_get_details,
  Employee_get_Logout,
  Employee_get_Service_Booking,
  Employee_put_jobs,
  Employee_put_Profile,
  employee_put_ServiceBooking,
  Employee_Send_otp,
  employee_signup_post,
} from "./EmployeeApicalls";
import { Response_ServiceBooking_Types } from "../../types/clients/UsersTypes";
import { JobsStateTypes } from "../../types/admin/admintypes";

const employee = localStorage.getItem("employee")
  ? JSON.parse(localStorage.getItem("employee") as string)
  : null;
const tempuser: EmployeeSignUpTypes = {
  username: "",
  email: "",
  phone: "",
  skills: "",
  experience: "",
  password: "",
  confirm_password: "",
};

const Service_booking_Employee: Response_ServiceBooking_Types[] = [];

const initialState: Employee_InitialState = {
  employee: employee ? employee : null,
  employeeServiceBooking: Service_booking_Employee,
  jobs:[],
  tempuser,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

const employeeslice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    empReset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.isLoading = false;
    },
    clearTempEmp: (state) => {
      state.tempuser = tempuser;
    },
    clearEmp: (state) => {
      state.employee = null;
    },
    setTempEmp: (state, action) => {
      const newemp: EmployeeSignUpTypes = action.payload;
      console.log("temporrey user", newemp);

      state.tempuser = newemp;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(employee_signup_post.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(employee_signup_post.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(employee_signup_post.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
        state.employee = null;
      })

      .addCase(Employee_Send_otp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Employee_Send_otp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.employee = action.payload;
      })
      .addCase(Employee_Send_otp.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
        state.employee = null;
      })

      .addCase(Emp_login_post.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Emp_login_post.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employee = action.payload;
      })
      .addCase(Emp_login_post.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
        state.employee = null;
      })
      .addCase(Employee_get_Logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Employee_get_Logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(Employee_get_Logout.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        }
      })
      .addCase(Employee_put_Profile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Employee_put_Profile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employee = action.payload;
      })
      .addCase(Employee_put_Profile.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(Employee_put_jobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Employee_put_jobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employee = action.payload;
      })
      .addCase(Employee_put_jobs.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(Employee_get_Service_Booking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        Employee_get_Service_Booking.fulfilled,
        (state, action: PayloadAction<Response_ServiceBooking_Types[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          console.log(action.payload);

          state.employeeServiceBooking = action.payload;
          console.log(state.employeeServiceBooking);
        }
      )
      .addCase(Employee_get_Service_Booking.rejected, (state, action) => {
        state.isSuccess = false;
        state.isError = true;
        if (action.payload) {
          state.message = action.payload.message;
        } else {
          state.message = "An unknown error occurred";
        }
      })
      .addCase(employee_put_ServiceBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(employee_put_ServiceBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newService_booking = action.payload;
        if (newService_booking.status=="CANCELLED") {
          localStorage.removeItem('service-booking')
          
        }

        state.employeeServiceBooking = state.employeeServiceBooking.map(
          (employee) =>
            employee.id === newService_booking.id
              ? newService_booking
              : employee

        );
      })
      .addCase(employee_put_ServiceBooking.rejected, (state,action) => {
        state.isSuccess = false;
        state.isError=true
       if(action.payload)
       {
        state.message=action.payload.message
       }

      })
      
      
      .addCase(employee_get_details.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(employee_get_details.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employee = action.payload

      })
      .addCase(employee_get_details.rejected, (state,action) => {
        state.isSuccess = false;
        state.isError=true
       if(action.payload)
       {
        state.message=action.payload.message
       }

      })
         .addCase(employee_get_allJobs.pending,(state)=>{
                        state.isLoading=true
                    })
                    .addCase(employee_get_allJobs.fulfilled,(state,action:PayloadAction<JobsStateTypes[]>)=>{
                        state.isLoading=false
                        state.isSuccess=true
                        state.jobs=action.payload
                        
                    })
                    .addCase(employee_get_allJobs.rejected,(state,action)=>{
                        state.isSuccess=false
                        state.isError=true
                        if (action.payload) {
                           
                            state.message = action.payload.message;
                          } else {
                            state.message = "An unknown error occurred";
                          }
                        
                    })
      
      
  },
});

export const { clearEmp, clearTempEmp, empReset, setTempEmp } =
  employeeslice.actions;
export default employeeslice.reducer;
