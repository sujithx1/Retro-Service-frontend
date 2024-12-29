import { useDispatch, useSelector } from "react-redux"
import Emp_Header from "../../../components/employee/header/Emp_Header"
import Emp_Sidebar from "../../../components/employee/sidebar/Emp_Sidebar"
import { AppDispatch, RootState } from "../../../store/store"
import { useEffect, useState } from "react"
import { Admin_get_allJobs } from "../../../reducers/admin/adminapicalls"
import { Employee_put_jobs } from "../../../reducers/employees/EmployeeApicalls"
import { Emp_Put_job } from "../../../types/employee/EmployeeTypes"
import { toast } from "react-toastify"
import { empReset } from "../../../reducers/employees/EmployeeReducers"

function Emp_jobs() {
    const { jobs } = useSelector((state: RootState) => state.admin); 
    const {employee,isSuccess,isError,message} = useSelector((state: RootState) => state.employee); 
    const [selectedJobs, setSelectedJobs] = useState<Emp_Put_job>({
        empId:employee?.id||"",
        jobName:"",
        isChecked:false

    });

    const dispatch: AppDispatch = useDispatch();
  
    useEffect(() => {
        if (isSuccess) {
            toast.success("success")
            dispatch(empReset())
            return
            
        }
        if (isError) {
            toast.error(message)
            dispatch(empReset())
            return
            
        }

      dispatch(Admin_get_allJobs());
    }, [dispatch,isSuccess,isError,message]);
  
    console.log(employee?.skills);


    
    const isSkillMatching = (job: string) => {

        console.log("Job Name:", job);
        console.log("Employee Skills:", employee?.skills);
        if (!employee?.skills || !job) {
          return false; 
        }
        return employee.skills.some(
          (skill: string) => skill.toLowerCase() === job.toLowerCase()
        );
      };


      const handleOnchange=(jobName:string,isChecked:boolean)=>{
        console.log("handle");
        
       
       if (isChecked) {
        setSelectedJobs((prev)=>({
            ...prev,
            jobName:jobName,
            isChecked:true
        }))

      const exist=employee?.skills.some(
        (skill: string) => skill.toLowerCase() === jobName.toLowerCase()
      )
      if (exist) {
        dispatch(Employee_put_jobs(selectedJobs))
        
        
      
      }
    }else{
        setSelectedJobs((prev)=>({
            ...prev,
            jobName:jobName,
            isChecked:false
        }))
        dispatch(Employee_put_jobs(selectedJobs))
    }
       
    }

    //   const handleJobSelection = (job: string, isChecked: boolean) => {
    //     setSelectedJobs((prevSelected:string[]) => {
    //       if (isChecked) {
    //         console.log(job);
            
    //         return [...prevSelected, job];
    //       } else {
    //         return prevSelected.filter((selectedJob) => selectedJob !== job);
    //       }
    //     });
    //   };
      
  
    return (
        <>
      <div className="flex">
        <Emp_Sidebar />
        <div className="flex flex-col w-full">
          <Emp_Header />
  
          <main className="flex-1 flex flex-col">
            <section className="p-6 flex-1">
              <h2 className="text-lg font-semibold mb-4">Jobs</h2>
              <div className="space-y-4">
                {jobs.map((job: { id: string; name: string }) => (
                  <div className="flex items-center gap-2" key={job.id}>
                    <input
                      type="checkbox"
                      id={`job-${job.id}`}
                      className="w-5 h-5"
                      defaultChecked={isSkillMatching(job.name)}
                      disabled={isSkillMatching(job.name)} // Disable checkbox for auto-selected jobs
                      onChange={(e)=>handleOnchange(job.name,e.target.checked)}
                    />
                    <label htmlFor={`job-${job.id}`} className="text-gray-700">
                      {job.name}
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}

export default Emp_jobs 