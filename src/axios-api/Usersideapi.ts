import axios from "axios";
import cookies from "js-cookie"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { clearUser } from "../reducers/users/UserReducers";


const  useraxiosInstance=axios.create({
    baseURL:`${import.meta.env.VITE_User_Url}`,
    timeout:10000,
    headers:{
        "Content-Type":'application/json',

    },
    withCredentials:true
})



useraxiosInstance.interceptors.request.use(
    (config)=>{
        const token=cookies.get('userToken')
        if(token)
        {
            config.headers.Authorization=`Bearer ${token}`
        }
    
       
        return config
    },

    (errr)=>{
        return Promise.reject(errr)

    }

)


useraxiosInstance.interceptors.response.use(

    (response) => response, 
     
    async (error) => {

const dispatch:AppDispatch=useDispatch()

        const originalRequest = error.config;  
        if (error.response && error.response.status === 401) {
          
            try {
                console.log("callig response use");
                
                const refreshToken = cookies.get('userToken');  // Get refresh token from cookies
                
                console.log(refreshToken,"refreshhhhhhhhhhhhhhhhhhhhhhh",refreshToken);
                if (!refreshToken) {
                    return Promise.reject("No refresh token available");  // Reject if no refresh token is found
                }
                
                // Request to refresh the access token
                const refreshResponse = await axios.post('http://localhost:3000/api/user/refresh-token', {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,  // Send refresh token in the request
                    },
                    withCredentials: true
                });
                console.log("refrshhhhhhhhhhhh",refreshResponse);
                
                
                // If the refresh token is valid, we get a new access token
                const newAccessToken = refreshResponse.data.accessToken;
                cookies.set('userToken', newAccessToken);  // Set the new access token in cookies
                console.log(newAccessToken,"newwwwwwwwww accessssssssssssstoken");
                
                // Retry the original request with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);  // Retry the original request with the new token
            } catch (refreshError) {
               
                dispatch(clearUser())
                localStorage.removeItem('user')
                return Promise.reject(refreshError);  // Reject if there's an error during token refresh
            }
        }
        return Promise.reject(error);  // Reject if not a 401 error
    }
);



export default useraxiosInstance