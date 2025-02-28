import { createSlice } from "@reduxjs/toolkit";
import { InitialState_store_types } from "../../types/storetypes";
import { Store_getAll_ProductWithstoreId, Store_put_Location, storeLoginPost, StoreRegister, StoreSendMailotp } from "./autopartsStoreapicalls";


const store = localStorage.getItem("store")? JSON.parse(localStorage.getItem("store") as string): null;

const initialState:InitialState_store_types={

    tempStore:null,
    localstore:null,
    store:store?store:null,
    products:[],

    isError:false,
    isPending:false,
    isSuccess:false,
    message:''
}

const storeSlice=createSlice({
    name:'store',
    initialState,
    reducers:{
        setTempstore:(state,action)=>{
            state.tempStore=action.payload
        },
        clear_Store:(state)=>{
            state.store=null
        }
    }
    ,
    extraReducers(builder) {
        builder
        .addCase(storeLoginPost.pending,(state)=>{
            state.isPending=true
        })
        .addCase(storeLoginPost.fulfilled,(state,action)=>{
            state.isPending=false
            state.isSuccess=true
            state.isError=false
            state.store=action.payload.store
            console.log(action.payload);
            
            console.log("state store",state.store);
            


        })
        .addCase(storeLoginPost.rejected,(state,action)=>{ 
            state.isPending=false
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
                
                state.message=action.payload.message 
            }
        })
        .addCase(Store_getAll_ProductWithstoreId.pending,(state)=>{
            state.isPending=true
        })
        .addCase(Store_getAll_ProductWithstoreId.fulfilled,(state,action)=>{
            state.isPending=false
            state.isSuccess=true
            state.products=action.payload
            console.log(action.payload);
            
            console.log("state store",state.store);
            


        })
        .addCase(Store_getAll_ProductWithstoreId.rejected,(state,action)=>{ 
            state.isPending=false
            state.isError=true
            if (action.payload) {
                
                state.message=action.payload.message 
            }
        })
        .addCase(Store_put_Location.pending,(state)=>{
            state.isPending=true
        })
        .addCase(Store_put_Location.fulfilled,(state,action)=>{
            state.isPending=false
            state.isSuccess=true
            state.isError=false
            if (state.store) {
                state.store.location=action.payload
                
            } 
            


        })
        .addCase(Store_put_Location.rejected,(state,action)=>{ 
            state.isPending=false
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
                
                state.message=action.payload.message 
            }
        })
        .addCase(StoreSendMailotp.pending,(state)=>{
            state.isPending=true
        })
        .addCase(StoreSendMailotp.fulfilled,(state,action)=>{
            state.isPending=false
            state.isSuccess=true
            state.isError=false
            
                state.localstore=action.payload
                
             
            


        })
        .addCase(StoreSendMailotp.rejected,(state,action)=>{ 
            state.isPending=false
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
                
                state.message=action.payload.message 
            }
        })
        .addCase(StoreRegister.pending,(state)=>{
            state.isPending=true
        })
        .addCase(StoreRegister.fulfilled,(state,action)=>{
            state.isPending=false
            state.isSuccess=true
            state.isError=false
            if (action.payload) {
                
                state.localstore=action.payload
            }
                
             
            


        })
        .addCase(StoreRegister.rejected,(state,action)=>{ 
            state.isPending=false
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
                
                state.message=action.payload.message 
            }
        })
    
    },
})


export const { setTempstore,clear_Store}=storeSlice.actions

export default storeSlice.reducer