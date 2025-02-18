import { createSlice } from "@reduxjs/toolkit";
import { InitialState_store_types } from "../../types/storetypes";


const store = localStorage.getItem("store")? JSON.parse(localStorage.getItem("store") as string): null;

const initialState:InitialState_store_types={
    store:store?store:null,
    isError:false,
    isPending:false,
    isSuccess:false,
    message:''
}

const storeSlice=createSlice({
    name:'store',
    initialState,
    reducers:{}
    ,
    // extraReducers(builder) {
    
    // },
})


// export const {}=storeSlice.actions

export default storeSlice.reducer