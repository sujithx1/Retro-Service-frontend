import { Locationuser_types } from "./clients/UsersTypes";


export interface Store_types{
    id:string;
    storeId:string;
    name:string;
    owner_name:string;
    owner_email:string;
    owner_phone:string;
    isActive:boolean;
    profilePic:string;
    location?:Locationuser_types
    
}
export interface InitialState_store_types{
    tempStore:storeRegister_types|null,
    localstore:Store_types|null,
    store:Store_types|null;
    products:Store_Product_types[];
    isSuccess:boolean;
    isError:boolean;
    isPending:boolean;
    message:string;
}


export interface storeRegister_types{

    name:string
    owner_name:string,
    owner_email:string,
    owner_phone:string,
    password:string,
    confirmPassword?:string,

}

export interface StoreSuccessResponseType {
  message: string;
  token: string;
  store: Store_types;
}


export interface Store_Product_types{
    id:string,
    _id?:string;
    name:string,
    storeId:string,
    description:string,
    price:number,
    stock:number,
    category:string,
    images:string[],
    isActive?:boolean


    
}