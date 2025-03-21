import { JobsStateTypes } from "../admin/admintypes";
import {
  Emp_Location_Types,
  EmployeeStateTypes,
} from "../employee/EmployeeTypes";
import {  Store_Product_types, Store_types } from "../storetypes";

export interface UserSignUpTypes {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}
export interface UserEditProfile {
  id: string;
  username: string;
  email?: string;
  phone: string;
  profilePic: string;
}
export interface UserImage_Types {
  id: string;
  profile_pic: string;
}
export interface UserStateTypes {
  id: string;
  _id?:string;
  username: string;
  email: string;
  phone: string;
  isActive?: boolean;
  authSourse?: string;
  role?: string;
  profilePic: string;
  location?: Locationuser_types;
}
export interface UserSuccessResponseType {
  message: string;
  token: string;
  user: UserStateTypes;
}

export interface  Address_Types {
  country: string;
  county: string;
  neighbourhood: string;
  postcode: string;
  road: string;
  state: string;
  state_district: string;
  suburb: string;
  town: string;
  city:string
}
export interface Locationuser_types{
  lat:number,
  lng:number,
  address:Address_Types
}
export interface Cords{
  lat:number,
  lng:number,
}

export interface FinduserLocation {
  lat: number;
  lng: number;
  address: string;
 
}
export interface UserLoginType {
  email: string;
  password: string;
}
export interface UserReport_FeedBack_types {
  id?: string;
  user: string;
  userEmail: string;
  rating: number;
  name: string;
  feedBack: string;
  employee: string;
  employeeEmail?: string;
  amount?:number;
  type?:string;
  refaund:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserInitialState {
  user: UserStateTypes | null;
  selectEmp: Emp_Location_Types;
  serviceBooking: ServiceBooking_Types | null;
  reqService: Response_Req_service_employee_types;
  bookingHistories: Response_Req_service_employee_types[];
  employee: EmployeeStateTypes[];
  jobs: JobsStateTypes[];
  tempuser: UserSignUpTypes;
  selectLocationuser?:FinduserLocation;
  cart:Cart|null;
  wishlists:WishlistTypes[],
  checkoutBoolean:boolean,
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  message: string;
}

export interface ErrorPayload {
  message: string;
  status?: number;
}
export interface Service_Booking_Sendreq_EveryEmp {
  userId: string;
  userLocation: FinduserLocation;
  userName: string;
  userEmail: string;
  problem: string;
  jobId: string;
  jobName: string;
  Min_wage: number;
}


export interface SendReqService_employee_types{
  serviceId:string,
  emplId:string
}

export interface ReqService_MechanicTypes{
  employeeId:string;
  bookingDate:Date;
  status:string
}

export interface Response_Req_service_employee_types {
  id: string;
  userId: string;
  userLocation: FinduserLocation;
  userName: string;
  userEmail: string;
  problem: string;
  jobId: string;
  jobName: string;
  minWage: number;
  mechanics: ReqService_MechanicTypes[];
  acceptEmployee: {
    employeeId: string;
    acceptTime: Date | null;
  };
  bookingDate: string;
  status: string;
  paymentId?: string;
}

export interface req_service_accept_types {
  id: string;
  status: string;
  employeeId: string;
}

export interface ServiceBooking_Types {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  problem: string;
  userLocation: string;
  employeeId: string;
  employeeName: string;
  empLocation: string;
  jobId: string;
  jobName: string;
  ServiceMin_wage: number;
  status: string;
}

export interface Response_ServiceBooking_Types {
  id: string;
  userId: string;
  userName: string;
  problem: string;
  userLocation: string;
  employeeId: string;
  employeeName: string;
  empLocation: string;
  jobId: string;
  jobName: string;
  service_Minwage: number;
  userProfilePic: string;
  bookingDate: string;
  status: string;
  userPhone: string;
}
export interface Service_Booking_Put_status_type {
  id: string;
  status: "CONFIRMED" | "CANCELLED";
}

export interface Razorpay_Service_types {
  // userId:string;
  // emmId:string;
  amount: number;
  currency: string;

  receipt: string;
}


export interface AdvancePayment_types{
  serviceId:string,
  empId:string;
  userId:string;
  amount:number
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

export interface Response_Razorpay_Service_types {
  amount: number;
  currency: string;
  id: string;
}
interface ServiveDetails {
  name: string;
  vehicleNumber: string;
  problem: string;
  phone: string;
}
export interface Response_ServiceBooking_History_types {
  id:string
  amount: number;
  employeeId: string;
  userId: string;
  status?: string;
  createdAt?: string;
  jobName: string;
  serviceDetails: ServiveDetails;
}

export interface ServicePayment_section {
  name: string;
  vehicleNumber: string;
  problem: string;
  phone: string;
  amount: number;
  employeeId: string;
  userId: string;
  status?: string;
  createdAt?: string;
  jobName: string;
  serviceId: string;
}

export interface TransactonsTypes{
  id: string;
  userId: string;
  type:  "purchase" | "refund" | "deposit" | "withdrawal"|"advancepay"|"payment"|'credited';
  amount: number;
  status: "complete" | "pending" | "failed";
  paymentMethod: "razorypay" | "wallet" | "cod";
  serviceType: "service" | "product";
  createdAt?: Date;

}

export interface ReviewRating_Types {
  rating: number;
  feedback: string;
  userId: string;
  employeeId: string;
  type:"report"|"feedback"
  amount?:number
  paymentId?:string,
  bookingId?:string
  // userEmail:string;
  // name:string
  
}

export interface ChatListItem {
  id: string;
  name: string;
  lastMessage: string;
  isOnline: boolean;
}

export interface User_Get_AllStores{
   store:Store_types,
   total_product:number,
   distance:number,
   rating:number
}

  export interface Cart{
    id:string,
    userId:UserStateTypes,
    storeId:string,
    products:{
      product:Store_Product_types,
      quantity:number;
      price:number
    }[],
  }

export interface Request_Cart{
  id:string,
  userId:string,
  storeId:string,
  productId:string,
  quantity:number;
  price:number
}
export interface Remove_Cart{
  id:string,
  userId:string,
 
  productId:string,
  

}


export interface Checkout_paymentTypes{
  cartId:string,
  total:number,
  paymentMethode:string,
  transactionId:string
}
export interface User_OrderHistorytypes{
 id?:string,
 userId:UserStateTypes,
 cart: { 
  products: Array<{ 
      product: Store_Product_types; 
      quantity: number; 
      price: number;
  }>;
 };
 total:number
 storeId:Store_types;
 paymentStatus:string;
 paymentMethod: string;
 orderStatus:string;
 transactionId?: string;
 concern?:string;
 createdAt: Date;
 updatedAt: Date;

}

export interface User_orderEdit_types{
  orderId:string;
  status:string,
  concern?:string

}


export interface WishlistTypes {
  id?: string; // Auto-generated by MongoDB
  userId: UserStateTypes; // User who owns the wishlist
  productId: Store_Product_types; // Product added to wishlist
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Add_WishlistTypes {
  userId: string; // User who owns the wishlist
  productId: string; // Product added to wishlist

}
