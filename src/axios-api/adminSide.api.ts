
import axios from "axios";
import Cookies from "js-cookie";


const Adminaxios_Instance=axios.create({
    baseURL:`${import.meta.env.VITE_Admin_Url}`,
    timeout:10000,
    headers:{
        'Content-Type':'application/json'
    }

})

Adminaxios_Instance.interceptors.request.use(
    (config)=>{
        const token=Cookies.get('adminToken')
        if (token) {
            config.headers.Authorization=`Bearer ${token}`
            
        } 
          return config
        
    },
    (err)=>{
        return Promise.reject(err)
    }
)


export default Adminaxios_Instance