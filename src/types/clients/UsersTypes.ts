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
    userId:string,
    userEmail:string,
    rating:number,
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
    reqService:Response_Req_service_employee_types,
bookingHistories:Response_Req_service_employee_types[]
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
export interface Response_Req_service_employee_types{
    id:string
    userId:string;
    userLocation:FinduserLocation,
    userName:string;
    userEmail:string;
    problem:string;
    jobId:string;
    jobName:string;
    minWage:number;
    mechanics:string[]
    acceptEmployee:{
        employeeId:string,
        acceptTime:Date|null
    },
    bookingDate:string
    status:string ,
    paymentId?:string      
}

export interface req_service_accept_types{
    id:string;
    status:string,
    employeeId:string


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


  export interface Razorpay_Service_types{
    // userId:string;
    // emmId:string;
    amount:number,
    currency:string,
   
    receipt:string
  }

//   export interface RazorpayConfirm_Service_types{
//     userId:string;
//     emmId:string;
//     amount:number,
//     currency:string, 
//     receipt:string
//     problem:string;
//     vehiclenumber:string;

//   }

  export interface Response_Razorpay_Service_types{
  
    amount:number,
    currency:string,
    id:string  ,
  
  }
interface ServiveDetails{
  name:string
  vehicleNumber:string;
  problem:string;
  phone:string;
}
export interface Response_ServiceBooking_History_types{

    amount:number;
    employeeId:string;
    userId:string,
    status?:string 
    createdAt?:string,
    jobName:string,
    serviceDetails:ServiveDetails
  
}

  export interface ServicePayment_section{
      name:string
      vehicleNumber:string;
      problem:string;
      phone:string;
      amount:number;
      employeeId:string;
      userId:string,
      status?:string 
      createdAt?:string,
      jobName:string,
      serviceId:string
      

  }


  export interface ReviewRating_Types{
    rating:number,
    feedback:string,
    userId:string,
    employeeId:string
  }

  export interface ChatListItem {
    id: string;
    name: string;
    lastMessage: string;
    isOnline: boolean;
  }
  