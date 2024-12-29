import axios from "axios";
import Cookies from "js-cookie";


export const employee_Axios_instance=axios.create({
    baseURL:`${import.meta.env.VITE_Employee_Url}`,
    timeout:10000,
    headers:{
        "Content-Type":"application/json"
    }

})


employee_Axios_instance.interceptors.request.use(
    (config)=>{
            const token=Cookies.get('employeeToken')
            if (token) {
                config.headers.Authorization=`Bearer ${token}`
                
            }
            return config

    },
    (err)=>{
        return Promise.reject(err)
    }
)