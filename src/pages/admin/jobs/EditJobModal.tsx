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


  const [errors, setErrors] = useState<{ name: string; description: string ,minimum_wage:string }>({ name: "", description: "" ,minimum_wage:"" });
  
  

    const [formValues, setFormValues] = useState<JobsStateTypes>({
        id:"",
        name: "",
        description: "",
        minimum_wage: 0,
      });
      const dispatch:AppDispatch=useDispatch()
      
      const validate = () => {
        const newErrors: { name?: string; description?: string; minimum_wage?: string } = {}; // ✅ Use optional keys
        if (!formValues.name.trim()) newErrors.name = "Category name is required.";
       if (!formValues.description.trim()) newErrors.description = "Description is required.";
       if (formValues.minimum_wage<100) newErrors.minimum_wage = "minimum 100 required.";
      
  setErrors({ 
    name: newErrors.name || "", 
    description: newErrors.description || "", 
    minimum_wage: newErrors.minimum_wage || "" 
  }); // ✅ Ensure all keys exist

  return !newErrors.name && !newErrors.description && !newErrors.minimum_wage; // Return true if no errors
      };

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
        if(!validate())return
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
         {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="text"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <input
            type="number"
            name="minimum_wage"
            value={formValues.minimum_wage}
            onChange={handleChange}
            placeholder="Minimum Wage"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            {errors.minimum_wage && <p className="text-red-500 text-sm">{errors.minimum_wage}</p>}

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