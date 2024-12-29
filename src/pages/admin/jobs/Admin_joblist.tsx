import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import AdminHeader from "../../../components/admin/header/AdminHeader";
import { JobsStateTypes } from "../../../types/admin/admintypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import EditJobModal from "./EditJobModal";
import AddJob from "./AddJob";
import { Admin_del_Job, Admin_get_allJobs } from "../../../reducers/admin/adminapicalls";
import { toast } from "react-toastify";
import { reset } from "../../../reducers/admin/adminReducers";



const Admin_joblist: React.FC = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModal,setAddModal]=useState<boolean>(false)
  const [jobToEdit, setJobToEdit] = useState<JobsStateTypes>({
    id:"",
    name:"",
    description:"",
    minimum_wage:0,
    
  });

  const {jobs,isError,message}=useSelector((state:RootState)=>state.admin)
  const dispatch:AppDispatch=useDispatch()
  useEffect(()=>{
    if (isError) {
      toast.error(message)
      dispatch(reset())
      return
      
    }
    dispatch(Admin_get_allJobs())
  },[dispatch,isError,message])

  console.log(jobs);
  
  const handleDelete=(id:string)=>{
    dispatch(Admin_del_Job(id))
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
    <AdminSidebar />
  
    <div className="flex flex-col w-full">
      <AdminHeader />
      <div className="p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Jobs Management</h1>
          <button
            onClick={() => {
              setAddModal(true);
            }}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Job
          </button>
        </div>
  
        {/* Jobs Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-96"> {/* Add overflow-x-auto and max-h-96 */}
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="p-4 text-sm font-medium text-gray-600">Description</th>
                  <th className="p-4 text-sm font-medium text-gray-600">Minimum Wage</th>
                  <th className="p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">{job.name}</td>
                    <td className="p-4">{job.description}</td>
                    <td className="p-4">₹{job.minimum_wage}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          job.isBlock
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {job.isBlock ? "Not Active" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setJobToEdit(job);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-yellow-600 hover:underline"
                      >
                        {job.isBlock ? "Activate" : "Deactivate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && (
              <p className="p-4 text-center text-gray-500">No jobs available.</p>
            )}
          </div>
        </div>
  
        {/* Add/Edit Modal */}
        {addModal && <AddJob onClose={() => setAddModal(false)} />}
        {isModalOpen && (
          <EditJobModal
            onClose={() => setIsModalOpen(false)}
            Job={jobToEdit}
          />
        )}
      </div>
    </div>
  </div>

  );
};

export default Admin_joblist;
