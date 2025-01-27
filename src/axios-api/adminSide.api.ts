
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




Adminaxios_Instance.interceptors.response.use(

    (response) => response, 
     
    async (error) => {
        console.log("Interceptor caught error:", error);
        console.log("Error response:", error.response);
    

// const dispatch:AppDispatch=useDispatch()

console.log("response");
// Debugging point
if (!error.response) {
    console.error("No response from server. Check your backend or network.");
    return Promise.reject(error);
}
const originalRequest = error.config;  
        
if (error.response && error.response.status === 401 && error.response.data.error === "jwt expired" && !originalRequest._retry) {
    originalRequest._retry = true; // Prevent retry loop
          
    try {
        console.log("Token expired, attempting to refresh token...");
        const refreshToken = Cookies.get('adminToken');
        if (!refreshToken) {
            console.error("No refresh token available. Logging out user.");
            // dispatch(clearUser());
            localStorage.removeItem('user');
            return Promise.reject("No refresh token available");
        }

        // Request a new access token
        const refreshResponse = await axios.post(
            'http://localhost:3000/api/admin/refresh-token',
            {},
            {
                headers: { Authorization: `Bearer ${refreshToken}` },
                withCredentials: true,
            }
        );
        console.log("Refresh successful, new token:", refreshResponse.data.accessToken);

        // Update token in cookies
        const newAccessToken = refreshResponse.data.accessToken;
        Cookies.set('userToken', newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
    } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);

        // Handle refresh failure (e.g., logout user)
    //    dispatch(clearUser());
        localStorage.removeItem('admin');
        return Promise.reject(refreshError);
    }
        }


        if (error.response.status === 403 && error.response.data.error === "Not an admin or invalid user") {
            console.error("admin is not valid. Redirecting to login.");
            localStorage.removeItem('user');
            Cookies.remove('userToken'); // Remove the token

            window.location.href='/login'; // Redirect to login
            return Promise.reject(error);
        }

        return Promise.reject(error);  // Reject if not a 401 error
    }
);




export default Adminaxios_Instance