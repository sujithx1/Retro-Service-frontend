
import axios from "axios";
import cookies from "js-cookie";


const storeApiInstance=axios.create({
    baseURL:`${import.meta.env.VITE_Store_Url}`,
    timeout:10000,
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true


})

storeApiInstance.interceptors.request.use(
    (config)=>{
        const token=cookies.get('storeToken')
        if (token) {
            config.headers.Authorization=`Bearer ${token}`
            
        } 
          return config
        
    },
    (err)=>{
        return Promise.reject(err)
    }
)






storeApiInstance.interceptors.response.use(

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
        const refreshToken = cookies.get('storeToken');
        if (!refreshToken) {
            console.error("No refresh token available. Logging out user.");
            // dispatch(clearUser());
            localStorage.removeItem('store');
            return Promise.reject("No refresh token available");
        }

        // Request a new access token
        const refreshResponse = await axios.post(
            'http://localhost:3000/api/store/refresh-token',
            {},
            {
                headers: { Authorization: `Bearer ${refreshToken}` },
                withCredentials: true,
            }
        );
        console.log("Refresh successful, new token:", refreshResponse.data.accessToken);

        // Update token in cookies
        const newAccessToken = refreshResponse.data.accessToken;
        cookies.set('storeToken', newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
    } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);

        // Handle refresh failure (e.g., logout user)
    //    dispatch(clearUser());

        localStorage.removeItem('store');
        
         window.location.href='/store/login'
        return Promise.reject(refreshError);
    }
        }
         // Handle employee block (e.g., 403 status or specific error message)
         if (error.response.status === 403 && error.response.data.error === "User not found or inactive") {
            console.error("user is blocked. Redirecting to login.");
            localStorage.removeItem('store');
            cookies.remove('storeToken'); // Remove the token

            window.location.href='/store/login'; // Redirect to login
            return Promise.reject(error);
        }

        return Promise.reject(error);  // Reject if not a 401 error
    }
);





export default storeApiInstance