import { JobsStateTypes } from "../admin/admintypes";
import { Emp_Location_Types, EmployeeStateTypes } from "../employee/EmployeeTypes";


export interface UserSignUpTypes{
    username:string;
    email:string;
    phone:string;
    password:string;
    confirm_password:string
}
export interface UserEditProfile{
    id:string;
    username:string,
    email?:string;
    phone:string;
    profilePic:string
}
export interface UserImage_Types{
    id:string,
    profile_pic:string
}
export interface UserStateTypes{
    id:string;
    username:string;
    email:string;
    phone:string;
    isActive?:boolean;
    authSourse?:string
    role?:string;
    profilePic:string;

}
export interface UserSuccessResponseType{
    message:string;
    token:string;
    user:UserStateTypes


}
export interface FinduserLocation{
    lat:number,
    lng:number,
    address:string
}
export interface UserLoginType{
    email:string;
    password:string;
}
export interface UserReport_FeedBack_types{
    id?:string
    userid:string,
    userEmail:string,
    name:string,
    feedBack:string;
    employeeId:string;
    employeeEmail?:string,
    createdAt?:Date
    updatedAt?:Date

}
export interface UserInitialState{
    user:UserStateTypes|null;
    selectEmp:Emp_Location_Types,
    serviceBooking:ServiceBooking_Types|null,
    employee:EmployeeStateTypes[]
    jobs:JobsStateTypes[]
    tempuser:UserSignUpTypes;
    isSuccess:boolean;
    isError:boolean;
    isLoading:boolean;
    message:string;
}

export interface ErrorPayload {
    message: string;
    status?: number;
  }
export interface Service_Booking_Sendreq_EveryEmp{
    userId:string;
    userLocation:FinduserLocation,
    userName:string;
    userEmail:string;
    problem:string;
    jobId:string;
    jobName:string;
    Min_wage:number;
    
}
  

  export interface ServiceBooking_Types{
    id:string;
    userId:string;
    userName:string;
    userEmail:string;
    problem:string;
    userLocation:string;
    employeeId:string;
    employeeName:string;
    empLocation:string;
    jobId:string;
    jobName:string;
    ServiceMin_wage:number,
    status:string,
    


    

  }

  export interface Response_ServiceBooking_Types{
    id:string;
    userId:string;
    userName:string;
    problem:string;
    userLocation:string;
    employeeId:string;
    employeeName:string;
    empLocation:string;
    jobId:string;
    jobName:string;
    service_Minwage:number,
    userProfilePic:string,
    bookingDate:string,
    status:string,
    userPhone:string


    

  }
  export interface Service_Booking_Put_status_type{
    id:string,
    status:"CONFIRMED"| "CANCELLED"
  }