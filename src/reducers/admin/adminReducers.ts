import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminInitialStateTypes, AdminSuccessTypes, CategoryStateTypes, JobsStateTypes } from "../../types/admin/admintypes";
import { Admin_add_category, Admin_add_Job, admin_Block_UnBlock_employee, admin_Block_UnBlock_User, Admin_del_Category, Admin_del_Job, Admin_edit_employee_put, Admin_edit_users_put, Admin_get_allCategories, Admin_get_allJobs, Admin_get_Employees, Admin_Get_FeedBack, Admin_get_users, Admin_put_category, Admin_put_Job, adminLoginPost } from "./adminapicalls";
// import { UserStateTypes } from "../../types/clients/UsersTypes";
import { EmployeeStateTypes } from "../../types/employee/EmployeeTypes";
import { UserReport_FeedBack_types, UserStateTypes } from "../../types/clients/UsersTypes";




const admin=localStorage.getItem('admin')?JSON.parse(localStorage.getItem('admin')as string):null

const users:UserStateTypes[]=[]
const employees:EmployeeStateTypes[]=[]
const jobs:JobsStateTypes[]=[]
const categories:CategoryStateTypes[]=[]
const feedbacks:UserReport_FeedBack_types[]=[]
const initialState:AdminInitialStateTypes={
    admin:admin?admin:null,
    users:users?users:[],
    employees:employees?employees:[],
    jobs:jobs?jobs:[],
    categories:categories?categories:[],
    feedbacks:feedbacks?feedbacks:[],

    isSuccess:false,
    isError:false,
    isLoading:false,
    message:""
}




const adminslices=createSlice({
    name:'admin',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isError=false
            state.isLoading=false
            state.isSuccess=false
            state.message=""
        }
        ,
        clearAdmin:(state)=>{
            state.admin=null
            console.log(state.admin);
            

        },
        updateEmployee(state, action: PayloadAction<EmployeeStateTypes>) {
            console.log(state.employees);
            
            const index = state.employees.findIndex(emp => emp.id == action.payload.id);
        
            if (index !== -1) {
              state.employees[index] = action.payload; // Update the employee
       
              
            }
          }, updateUsers(state, action: PayloadAction<UserStateTypes>) {
            console.log(state.users);
            
            const index = state.users.findIndex(emp => emp.id == action.payload.id);
        
            if (index !== -1) {
              state.users[index] = action.payload; // Update the employee
       
              
            }
          },
          updateCategory(state, action: PayloadAction<CategoryStateTypes>) {
            console.log(state.categories);
            
            const index = state.categories.findIndex(cat => cat.id == action.payload.id);
        
            if (index !== -1) {
              state.categories[index] = action.payload; // Update the employee
              
              
            }
          },
    
    },
    extraReducers(builder) {
        builder
        .addCase(adminLoginPost.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(adminLoginPost.fulfilled,(state,action:PayloadAction<AdminSuccessTypes>)=>{
            state.isLoading=false
            state.isError=false
            state.isSuccess=true
            state.admin=action.payload.admin
            state.users=action.payload.users
            state.employees=action.payload.employees
            state.jobs=action.payload.jobs
            state.categories=action.payload.categories
            console.log(state.users);
            
        })
        .addCase(adminLoginPost.rejected,(state,action)=>{
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
              console.log("admin login err",action.payload);
              
               
                state.message = action.payload.message;
              } else {
                state.message = "An unknown error occurred";
              }
        })
        .addCase(Admin_get_Employees.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(Admin_get_Employees.fulfilled,(state,action:PayloadAction<EmployeeStateTypes[]>)=>{
            state.isLoading=false
            state.isSuccess=true;
            state.employees=action.payload 


        })
        .addCase(Admin_get_Employees.rejected,(state,action)=>{
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
               
                state.message = action.payload.message;
              } else {
                state.message = "An unknown error occurred";
              }
        })
        .addCase(Admin_edit_employee_put.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(Admin_edit_employee_put.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
                const newEmp:EmployeeStateTypes=action.payload
                console.log("new Empp",newEmp);
                

                state.employees = state.employees.map((employee) =>
                    employee.id === newEmp.id ? newEmp : employee
                  );
                  
        })
        .addCase(Admin_edit_employee_put.rejected,(state,action)=>{
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
               
                state.message = action.payload.message;
              } else {
                state.message = "An unknown error occurred";
              }
           
                })

        .addCase(admin_Block_UnBlock_employee.pending,(state)=>{
            state.isLoading=true

        })
        .addCase(admin_Block_UnBlock_employee.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            const newEmp:EmployeeStateTypes=action.payload

            state.employees = state.employees.map((employee) =>
                employee.id === newEmp.id ? newEmp : employee
              );
              

        })
        .addCase(admin_Block_UnBlock_employee.rejected,(state,action)=>{
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
               
                state.message = action.payload.message;
              } else {
                state.message = "An unknown error occurred";
              }
        })
        .addCase(Admin_get_users.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(Admin_get_users.fulfilled,(state,action:PayloadAction<UserStateTypes[]>)=>{
            state.isLoading=false
            state.isSuccess=true
            state.users=action.payload
            
        })
        .addCase(Admin_get_users.rejected,(state,action)=>{
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
               
                state.message = action.payload.message;
              } else {
                state.message = "An unknown error occurred";
              }
            
        })
        .addCase(Admin_edit_users_put.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(Admin_edit_users_put.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
                const newUser:UserStateTypes=action.payload
                console.log("new Empp",newUser);
                

                state.users = state.users.map((user) =>
                    user.id === newUser.id ? newUser : user
                  );
                  
        })
        .addCase(Admin_edit_users_put.rejected,(state,action)=>{
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
               
                state.message = action.payload.message;
              } else {
                state.message = "An unknown error occurred";
              }
           
                })


                .addCase(admin_Block_UnBlock_User.pending,(state)=>{
                  state.isLoading=true
      
              })
              .addCase(admin_Block_UnBlock_User.fulfilled,(state,action)=>{
                  state.isLoading=false
                  state.isSuccess=true
                  const newUser:UserStateTypes=action.payload
      
                  state.users = state.users.map((user) =>
                      user.id === newUser.id ? newUser : user
                    );
                    
      
              })
              .addCase(admin_Block_UnBlock_User.rejected,(state,action)=>{
                  state.isSuccess=false
                  state.isError=true
                  if (action.payload) {
                     
                      state.message = action.payload.message;
                    } else {
                      state.message = "An unknown error occurred";
                    }
              })

              .addCase(Admin_add_category.pending,(state)=>{
                state.isLoading=true
              })
              .addCase(Admin_add_category.fulfilled,(state,action)=>{

                state.isLoading=false
                state.isSuccess=true
                const nweCat=action.payload
                state.categories.push(nweCat)

                

              })
              .addCase(Admin_add_category.rejected,(state,action)=>{
                state.isSuccess=false
                state.isError=true
                console.log(action.payload);
                
                if (action.payload) {
                  state.message=action.payload.message
                  
                }else
                {
                  state.message = "An unknown error occurred";
                }
              })
              .addCase(Admin_get_allCategories.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(Admin_get_allCategories.fulfilled,(state,action:PayloadAction<CategoryStateTypes[]>)=>{
                state.isLoading=false
                state.isSuccess=true
                state.categories=action.payload
                
            })
            .addCase(Admin_get_allCategories.rejected,(state,action)=>{
                state.isSuccess=false
                state.isError=true
                if (action.payload) {
                   
                    state.message = action.payload.message;
                  } else {
                    state.message = "An unknown error occurred";
                  }
                
            })


            .addCase(Admin_del_Category.pending,(state)=>{
              state.isLoading=true
  
          })
          .addCase(Admin_del_Category.fulfilled,(state,action)=>{
              state.isLoading=false
              state.isSuccess=true
              const newcat:CategoryStateTypes=action.payload
  
              state.categories = state.categories.map((category) =>
                  category.id === newcat.id ? newcat : category
                );
                
  
          })
          .addCase(Admin_del_Category.rejected,(state,action)=>{
              state.isSuccess=false
              state.isError=true
              if (action.payload) {
                 
                  state.message = action.payload.message;
                } else {
                  state.message = "An unknown error occurred";
                }
          })


          .addCase(Admin_put_category.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(Admin_put_category.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
                const newCategory:CategoryStateTypes=action.payload
                console.log("new Empp",newCategory);
                

                state.categories = state.categories.map((category) =>
                    category.id === newCategory.id ? newCategory : category
                  );
                  
        })
        .addCase(Admin_put_category.rejected,(state,action)=>{
            state.isSuccess=false
            state.isError=true
            if (action.payload) {
               
                state.message = action.payload.message;
              } else {
                state.message = "An unknown error occurred";
              }
           
                })

                .addCase(Admin_get_allJobs.pending,(state)=>{
                  state.isLoading=true
              })
              .addCase(Admin_get_allJobs.fulfilled,(state,action:PayloadAction<JobsStateTypes[]>)=>{
                  state.isLoading=false
                  state.isSuccess=true
                  state.jobs=action.payload
                  
              })
              .addCase(Admin_get_allJobs.rejected,(state,action)=>{
                  state.isSuccess=false
                  state.isError=true
                  if (action.payload) {
                     
                      state.message = action.payload.message;
                    } else {
                      state.message = "An unknown error occurred";
                    }
                  
              })


              .addCase(Admin_put_Job.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(Admin_put_Job.fulfilled,(state,action)=>{
                state.isLoading=false
                state.isSuccess=true
                    const newJob:JobsStateTypes=action.payload
                    console.log("new job",newJob);
                    
    
                    state.jobs = state.jobs.map((job) =>
                        job.id === newJob.id ? newJob : job
                      );
                      
            })
            .addCase(Admin_put_Job.rejected,(state,action)=>{
                state.isSuccess=false
                state.isError=true
                if (action.payload) {
                   
                    state.message = action.payload.message;
                  } else {
                    state.message = "An unknown error occurred";
                  }
               
                    })


                    .addCase(Admin_del_Job.pending,(state)=>{
                      state.isLoading=true
          
                  })
                  .addCase(Admin_del_Job.fulfilled,(state,action)=>{
                      state.isLoading=false
                      state.isSuccess=true
                      const newJob:JobsStateTypes=action.payload
          
                      state.jobs = state.jobs.map((job) =>
                          job.id === newJob.id ? newJob : job
                        );
                        
          
                  })
                  .addCase(Admin_del_Job.rejected,(state,action)=>{
                      state.isSuccess=false
                      state.isError=true
                      if (action.payload) {
                         
                          state.message = action.payload.message;
                        } else {
                          state.message = "An unknown error occurred";
                        }
                  })
                  .addCase(Admin_add_Job.pending,(state)=>{
                    state.isLoading=true
                  })
                  .addCase(Admin_add_Job.fulfilled,(state,action)=>{
    
                    state.isLoading=false
                    state.isSuccess=true
                    const newJob=action.payload
                    state.jobs.push(newJob)
    
                    
    
                  })
                  .addCase(Admin_add_Job.rejected,(state,action)=>{
                    state.isSuccess=false
                    state.isError=true
                    console.log(action.payload);
                    
                    if (action.payload) {
                      state.message=action.payload.message
                      
                    }else
                    {
                      state.message = "An unknown error occurred";
                    }
                  })
                  .addCase(Admin_Get_FeedBack.pending,(state)=>{
                    state.isLoading=true
                  })
                  .addCase(Admin_Get_FeedBack.fulfilled,(state,action:PayloadAction<UserReport_FeedBack_types[]>)=>{
    
                    state.isLoading=false
                    state.isSuccess=true
                    state.feedbacks=action.payload
                    
    
                    
    
                  })
                  .addCase(Admin_Get_FeedBack.rejected,(state,action)=>{
                    state.isSuccess=false
                    state.isError=true
                    console.log(action.payload);
                    
                    if (action.payload) {
                      state.message=action.payload.message
                      
                    }else
                    {
                      state.message = "An unknown error occurred";
                    }
                  })
    },

})


export const {reset,clearAdmin,updateEmployee,updateUsers,updateCategory}=adminslices.actions
export default adminslices.reducer
