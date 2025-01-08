import { createAsyncThunk } from "@reduxjs/toolkit";
import Adminaxios_Instance from "../../axios-api/adminSide.api";
import { isAxiosError } from "axios";
import { Add_category, Add_Job, AdminLoginTypes, AdminSuccessTypes, CategoryStateTypes, JobsStateTypes } from "../../types/admin/admintypes";
import { ErrorPayload, UserReport_FeedBack_types, UserStateTypes } from "../../types/clients/UsersTypes";
import { EmployeeStateTypes } from "../../types/employee/EmployeeTypes";
import Cookies from "js-cookie";

export const adminLoginPost = createAsyncThunk<
AdminSuccessTypes,
AdminLoginTypes,
  { rejectValue: ErrorPayload }
>("/admin/login", async (adminData, { rejectWithValue }) => {
  try {
    const response = await Adminaxios_Instance.post("login", adminData);
    if (response.data && response.data.admintoken) {

      localStorage.setItem("admin", JSON.stringify(response.data));
      Cookies.set('adminToken', response.data.admintoken, {
        expires: 7, // Expires in 7 days
        path: '/',
        secure: true, // Use `true` only in HTTPS
      });

      return response.data;
    }
  } catch (error) {
    console.log("Admin eroror",error);
    
    if (isAxiosError(error)) {
      return rejectWithValue({
    
        
        message: error.response?.data?.error || "something an error occured",
        status: error.response?.status,
      });
    }
    return rejectWithValue({ message: "something went  problem " });
  }
});



  export const Admin_get_Employees = createAsyncThunk<
    EmployeeStateTypes[], 
    void,                
    { rejectValue: ErrorPayload } 
  >(
    '/admin/getEmployees',
    async (_, { rejectWithValue }) => {
      try {
        
        const response = await Adminaxios_Instance.get('/employees')
        return response.data.employees 
      } catch (error) {
        if (isAxiosError(error)) {
    return rejectWithValue({
      message:error.response?.data.error,
      status:error.response?.status
    })        
        }
        return rejectWithValue({
          message:"Something problem geting employees"
        })
      
      }
    }
  );

export const Admin_edit_employee_put=createAsyncThunk<EmployeeStateTypes,EmployeeStateTypes,{rejectValue:ErrorPayload}>('/admin/employee/edit',async(employeeData,{rejectWithValue})=>{

  try {
    const response=await Adminaxios_Instance.put('/employee',employeeData)
    if(response.data)return response.data.employee
    
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error,
        status:error.response?.status
      })
      
    }
    return rejectWithValue({
      message:'something wrong for edit emmployee'
    })
    
  }

})


export  const admin_Block_UnBlock_employee=createAsyncThunk<EmployeeStateTypes,string ,{rejectValue:ErrorPayload}>('/admin/employee/block',async(id,{rejectWithValue})=>{
try {
  const response= await Adminaxios_Instance.delete(`/employee/${id}`)
  if (response.data) {
    return response.data.employee
    
  }
  
} catch (error) {
  if (isAxiosError(error)) {
    return rejectWithValue({
      message:error.response?.data.error
      ,status:error.response?.status
    })

    
  }
  return rejectWithValue({
    message:"something error "
  })
  
}
})




export const Admin_get_users = createAsyncThunk<UserStateTypes[],void,{rejectValue:ErrorPayload}>(
  'admin/getUsers',
  async (_,{rejectWithValue}) => {
    try {
      const response = await Adminaxios_Instance.get('/users')
     
    return response.data.users; // Ensure correct typing
    } catch (error) {
      if(isAxiosError(error))
      {
return rejectWithValue({
  message:error.response?.data.error,
  status:error.response?.status
})

      }
      return rejectWithValue({
        message:'something error '
      })
      
    }
  }
);




export const Admin_edit_users_put=createAsyncThunk<UserStateTypes,UserStateTypes,{rejectValue:ErrorPayload}>('/admin/users/edit',async(usersData,{rejectWithValue})=>{

  try {
    const response=await Adminaxios_Instance.put('/user',usersData)
    if(response.data)return response.data.user
    
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error,
        status:error.response?.status
      })
      
    }
    return rejectWithValue({
      message:'something wrong for edit user'
    })
    
  }

})



export  const admin_Block_UnBlock_User=createAsyncThunk<UserStateTypes,string ,{rejectValue:ErrorPayload}>('/admin/user/block',async(id,{rejectWithValue})=>{
  try {
    const response= await Adminaxios_Instance.delete(`/user/${id}`)
    if (response.data) {
      return response.data.user
      
    }
    
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })
  
      
    }
    return rejectWithValue({
      message:"something error "
    })
    
  }
  })
  

export const Admin_add_category=createAsyncThunk<CategoryStateTypes,Add_category,{rejectValue:ErrorPayload}>('/admin/addcategory',async (categoryDate,{rejectWithValue})=>{
  try {
    const response=await Adminaxios_Instance.post('/category',categoryDate)
    if(response.data)return response.data.category
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error,
        status:error.response?.status
      })
      
    }
    return rejectWithValue({message:'something problem adding category'})
    
  }

})


export const Admin_get_allCategories=createAsyncThunk<CategoryStateTypes[],void,{rejectValue:ErrorPayload}>('/admin/getcategroires',async(_,{rejectWithValue})=>{
  try {
    const response=await Adminaxios_Instance.get('/categories')
    if(response.data)return response.data.categories
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
    
  }



})

export const Admin_del_Category=createAsyncThunk<CategoryStateTypes,string,{rejectValue:ErrorPayload}>('/admin/delCatgeory',async(id,{rejectWithValue})=>{

  try {
    const response=await Adminaxios_Instance.delete(`/category/${id}`)
    if(response.data)return response.data.category
  } catch (error) {
   
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting categories"
    })
  }

})

export const Admin_put_category=createAsyncThunk<CategoryStateTypes,CategoryStateTypes,{rejectValue:ErrorPayload}>('/admin/editcategory',async(categoryData,{rejectWithValue})=>{

  try {
    const response=await Adminaxios_Instance.put(`/category/${categoryData.id}`,categoryData)
    if(response.data)return response.data.category
    
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error,
        status:error.response?.status
      })
      
    }
    return rejectWithValue({
      message:'something wrong for edit category'
    })
    
  }

})


export const Admin_get_allJobs=createAsyncThunk<JobsStateTypes[],void,{rejectValue:ErrorPayload}>('/admin/getjobs',async(_,{rejectWithValue})=>{
  try {
    const response=await Adminaxios_Instance.get('/jobs')
    if(response.data)return response.data.jobs
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong geting jobs"
    })
    
  }
})


export const Admin_put_Job=createAsyncThunk<JobsStateTypes,JobsStateTypes,{rejectValue:ErrorPayload}>('/admin/editjob',async(jobData,{rejectWithValue})=>{

  try {
    const response=await Adminaxios_Instance.put(`/job/${jobData.id}`,jobData)
    if(response.data)return response.data.job
    
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error,
        status:error.response?.status
      })
      
    }
    return rejectWithValue({
      message:'something wrong for edit job'
    })
    
  }

})


export const Admin_del_Job=createAsyncThunk<JobsStateTypes,string,{rejectValue:ErrorPayload}>('/admin/deljob',async(id,{rejectWithValue})=>{

  try {
    const response=await Adminaxios_Instance.delete(`/job/${id}`)
    if(response.data)return response.data.job
  } catch (error) {
   
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error
        ,status:error.response?.status
      })

      
    }
    return rejectWithValue({
      message:"something wrong delete job"
    })
  }

})



export const Admin_add_Job=createAsyncThunk<JobsStateTypes,Add_Job,{rejectValue:ErrorPayload}>('/admin/addJob',async (JobData,{rejectWithValue})=>{
  try {
    const response=await Adminaxios_Instance.post('/job',JobData)
    if(response.data)return response.data.job
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error,
        status:error.response?.status
      })
      
    }
    return rejectWithValue({message:'something problem adding job'})
    
  }

})



export const Admin_Get_FeedBack=createAsyncThunk<UserReport_FeedBack_types[],void,{rejectValue:ErrorPayload}>('/admin/getFeedback',async (_,{rejectWithValue})=>{
  try {
    const response=await Adminaxios_Instance.get('/report-feedback')
    if(response.data){
      console.log("feedbacks",response.data);
      
      return response.data.feedback}

  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({
        message:error.response?.data.error,
        status:error.response?.status
      })
      
    }
    return rejectWithValue({message:'something problem adding job'})
    
  }

})