'use client'

import { useDispatch, useSelector } from "react-redux";
import Emp_Header from "../../../components/employee/header/Emp_Header";
import Emp_Sidebar from "../../../components/employee/sidebar/Emp_Sidebar";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { employee_get_allJobs, Employee_put_jobs } from "../../../reducers/employees/EmployeeApicalls";
// import { Emp_Put_job } from "../../../types/employee/EmployeeTypes";
import { toast } from "react-toastify";
import { empReset } from "../../../reducers/employees/EmployeeReducers";
import { JobsStateTypes } from "../../../types/admin/admintypes";
import { Emp_Put_job } from "../../../types/employee/EmployeeTypes";

function Emp_jobs() {
  const { employee, isSuccess, isError, message, jobs } = useSelector(
    (state: RootState) => state.employee
  );

  const [currentJobs, setCurrentJobs] = useState<JobsStateTypes[]>([]);
  const [availableJobs, setAvailableJobs] = useState<JobsStateTypes[]>([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(empReset());
    }
    if (isError) {
      toast.error(message);
      dispatch(empReset());
    }

    return () => {
      dispatch(empReset());
    };
  }, [dispatch, isSuccess, isError, message]);

  useEffect(() => {
    dispatch(employee_get_allJobs());
  }, [dispatch]);

  useEffect(() => {
    const isSkillMatching = (job: string) => {
      if (!employee?.skills || !job) {
        return false;
      }
      return employee.skills.some(
        (skill: string) => skill.toLowerCase() === job.toLowerCase()
      );
    };
  
    setCurrentJobs(jobs.filter(job => isSkillMatching(job.name)));
    setAvailableJobs(jobs.filter(job => !isSkillMatching(job.name)));
  }, [jobs, employee?.skills]);
  
  const handleOnchange = (jobName: string, isChecked: boolean) => {
    if (isChecked) {
      const jobToAdd = availableJobs.find(
        (job:JobsStateTypes) => job.name.toLowerCase() === jobName.toLowerCase()
      );

      if (employee?.id && jobToAdd) {
          
        const jobadd:Emp_Put_job={
          empId:employee.id
          ,
          jobAdd:jobToAdd
        }

        dispatch(Employee_put_jobs(jobadd))
      }
     

      console.log("job added", jobToAdd);
      
      if (jobToAdd) {
        const updatedCurrentJobs = [...currentJobs, jobToAdd];
        const updatedAvailableJobs = availableJobs.filter(
          (job:JobsStateTypes) => job.name.toLowerCase() !== jobName.toLowerCase()
        );

        setCurrentJobs(updatedCurrentJobs);
        setAvailableJobs(updatedAvailableJobs);
      }
    } else {
      const jobToRemove = currentJobs.find(
        (job:JobsStateTypes) => job.name.toLowerCase() === jobName.toLowerCase()
      );

      if (jobToRemove) {
        const updatedAvailableJobs = [...availableJobs, jobToRemove];
        const updatedCurrentJobs = currentJobs.filter(
          (job:JobsStateTypes) => job.name.toLowerCase() !== jobName.toLowerCase()
        );

        setCurrentJobs(updatedCurrentJobs);
        setAvailableJobs(updatedAvailableJobs);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Emp_Sidebar />
      <div className="flex flex-col flex-1">
        <Emp_Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Current Jobs Section */}
            <section className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Current Jobs
                </h2>
                <div className="divide-y divide-gray-200">
                  {currentJobs.map((job: { id: string; name: string }) => (
                    <div
                      key={job.id}
                      className="flex items-center py-3 px-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-gray-700 font-medium">
                          {job.name}
                        </span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        Active
                      </span>
                    </div>
                  ))}
                  {currentJobs.length === 0 && (
                    <p className="text-gray-500 py-4 text-center">
                      No current jobs assigned
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Available Jobs Section */}
            <section className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Available Jobs
                </h2>
                <div className="divide-y divide-gray-200">
                  {availableJobs.map((job: { id: string; name: string }) => (
                    <div
                      key={job.id}
                      className="flex items-center py-3 px-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 flex-1">

                        <label
                          htmlFor={`job-${job.id}`}
                          className="text-gray-700 font-medium cursor-pointer"
                        >
                          {job.name}
                        </label>
                      </div>
                      <button
                        className="text-sm text-blue-600 font-medium hover:text-blue-700"
                        onClick={() => handleOnchange(job.name, true)}
                      >
                        Add Job
                      </button>
                    </div>
                  ))}
                  {availableJobs.length === 0 && (
                    <p className="text-gray-500 py-4 text-center">
                      No available jobs to add
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Emp_jobs;
