

export interface Store_types{
    id:string;
    storeId:string;
    store_name:string;
    owner_name:string;
    owner_email:string;
    owner_phone:string;
    isActive:boolean;
    profilePic:string;
    
}
export interface InitialState_store_types{
    store:Store_types|null;
    isSuccess:boolean;
    isError:boolean;
    isPending:boolean;
    message:string;
}
