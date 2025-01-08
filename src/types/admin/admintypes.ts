import { UserReport_FeedBack_types, UserStateTypes } from "../clients/UsersTypes";
import { EmployeeStateTypes } from "../employee/EmployeeTypes";



export interface AdminLoginTypes{
    email:string;
    password:string;


}
export interface Add_Job{
    name:string;
    description:string;
    minimum_wage:number;
}

export interface JobsStateTypes{
    id:string
    name:string;
    description:string;
    minimum_wage:number;
    isBlock?:boolean
    image?:string
}
export interface CategoryStateTypes{
    id:string;
    name:string;
    description:string;
    isBlock?:boolean
}

export interface AdminSuccessTypes{
message:string;
    admin:UserStateTypes;
    admintoken:string;
    users:UserStateTypes[];
    employees:EmployeeStateTypes[];
    jobs:JobsStateTypes[];
    categories:CategoryStateTypes[]



    
}
export interface AdminStatetypes{
    id:string,
    username:string;
    email:string;
    phone:string;
    profilePic:string
}

export interface AdminInitialStateTypes{
    admin:AdminStatetypes|null;
    users:UserStateTypes[];
    employees:EmployeeStateTypes[];
    jobs:JobsStateTypes[];
    categories:CategoryStateTypes[],
    feedbacks:UserReport_FeedBack_types[],
    isSuccess:boolean;
    isError:boolean;
    isLoading:boolean
    message:string;

}

export interface Add_category{
    name:string;
    description:string
}

