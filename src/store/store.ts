import { configureStore } from "@reduxjs/toolkit";

import userReducers from "../reducers/users/UserReducers"
import adminReducers from "../reducers/admin/adminReducers"
import employeeReducers from "../reducers/employees/EmployeeReducers"
import storeautoparts from "../reducers/autopartsstore/autopartsstorereducerse"
export const store=configureStore({
    reducer:{

        user:userReducers,
        admin:adminReducers,
        employee:employeeReducers,
        store:storeautoparts

    }
})


export type RootState= ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch