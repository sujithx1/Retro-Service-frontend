import { configureStore } from "@reduxjs/toolkit";

import userReducers from "../reducers/users/UserReducers"
import adminReducers from "../reducers/admin/adminReducers"
import employeeReducers from "../reducers/employees/EmployeeReducers"
export const store=configureStore({
    reducer:{

        user:userReducers,
        admin:adminReducers,
        employee:employeeReducers

    }
})


export type RootState= ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch