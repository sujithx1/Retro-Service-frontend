import axios from "axios";
import Cookies from "js-cookie";


export const employee_Axios_instance=axios.create({
    baseURL:`${import.meta.env.VITE_Employee_Url}`,
    timeout:10000,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true


})


employee_Axios_instance.interceptors.request.use(
    (config)=>{
        console.log("employeee req")
        
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



employee_Axios_instance.interceptors.response.use(
    (response) => response, 
    async (error) => {
        console.log("Interceptor caught error:", error);
        console.log("Error response:", error.response);


        // Check if there is no response
        if (!error.response) {
            console.error("No response from server. Check your backend or network.");
            return Promise.reject(error);
        }

        const originalRequest = error.config;
     

        // Handle JWT expired
        if (error.response.status === 401 && error.response.data.error === "jwt expired" && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent retry loop

            try {
                console.log("Token expired, attempting to refresh token...");
                const refreshToken = Cookies.get('employeeToken');
                if (!refreshToken) {
                    console.error("No refresh token available. Logging out user.");
                    localStorage.removeItem('employee');
                    window.location.href='/employee/login' ; // Redirect to login
                    return Promise.reject("No refresh token available");
                }

                // Request a new access token
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_Employee_Url}/refresh-token`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                        withCredentials: true,
                    }
                );

                console.log("Refresh successful, new token:", refreshResponse.data.accessToken);

                // Update token in cookies
                const newAccessToken = refreshResponse.data.accessToken;
                Cookies.set('employeeToken', newAccessToken);

                // Retry the original request with the new access token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                localStorage.removeItem('employee');
                window.location.href='/employee/login'  ; // Redirect to login
                return Promise.reject(refreshError);
            }
        }
        console.log("hai");
        
        // Handle employee block (e.g., 403 status or specific error message)
        if (error.response.status === 403 && error.response.data.error === "Employee not found or inactive") {
            console.error("Employee is blocked. Redirecting to login.");
            localStorage.removeItem('employee');
            window.location.href='/employee/login'; // Redirect to login
            return Promise.reject(error);
        }

        return Promise.reject(error); // Reject if not handled
    }
);
