import { Response_ServiceBooking_Types } from "../clients/UsersTypes";


export interface EmployeeSignUpTypes{
    username:string;
    email:string;
    phone:string;
    skills:string;
    experience:string;
    password:string;
    confirm_password:string;
}
export interface EmployeeStateTypes{
    id:string;
    username:string;
    email:string;
    phone:string;
    isActive?:boolean;
    profilePic:string
    skills:string[];

    experience:number,
    location?:string

}
export interface Employee_InitialState{
    employee:EmployeeStateTypes|null;
    employeeServiceBooking:Response_ServiceBooking_Types[]
    tempuser:EmployeeSignUpTypes;
    isSuccess:boolean;
    isError:boolean;
    isLoading:boolean;
    message:string;
}

export interface Emp_Location_Types{
    id:string;
    username:string;
    lat:number;
    lng:number;
    location?:string;
    email?:string
    userLocation?:string;
}

export interface Employee_EditProfile_types{
    id:string;
    username:string,
    email?:string;
    phone:string;
    profilePic:string;
    // skills:string[];
    experience:number|string,
    location:string


}

export interface Emp_Put_job{
    empId:string,
    jobName:string,
    isChecked:boolean
}