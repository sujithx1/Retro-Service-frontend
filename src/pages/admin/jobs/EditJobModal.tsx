import  { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react'
import { JobsStateTypes } from '../../../types/admin/admintypes';
import { AppDispatch } from '../../../store/store';
import { useDispatch } from 'react-redux';
import {  Admin_put_Job } from '../../../reducers/admin/adminapicalls';
interface  Props{
    onClose:()=>void
    Job:JobsStateTypes
}

const EditJobModal:FC<Props> = ({onClose,Job}) => {

    const [formValues, setFormValues] = useState<JobsStateTypes>({
        id:"",
        name: "",
        description: "",
        minimum_wage: 0,
      });
const dispatch:AppDispatch=useDispatch()
      useEffect(()=>{
        setFormValues(Job)

      },[Job])


      const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
        const{name,value}=e.target
        setFormValues((prev)=>({
            ...prev,
            [name]:value
        }))
      }
      const handleSubmit=(e:FormEvent)=>{
        e.preventDefault()
        dispatch(Admin_put_Job(formValues))
        onClose()
        
      }
    
  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
        </h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Job Name"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="minimum_wage"
            value={formValues.minimum_wage}
            onChange={handleChange}
            placeholder="Minimum Wage"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    </>
  )
}

export default EditJobModal