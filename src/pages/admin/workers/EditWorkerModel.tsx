// import { useState } from "react";

import { ChangeEvent, FC, useState } from "react"
import { EmployeeStateTypes } from "../../../types/employee/EmployeeTypes"
import { useDispatch,  } from "react-redux"
import { AppDispatch, } from "../../../store/store"
import { Admin_edit_employee_put } from "../../../reducers/admin/adminapicalls"
import { updateEmployee } from "../../../reducers/admin/adminReducers"

interface Props{
    editEmployee:EmployeeStateTypes,
    onclose:()=>void
}
const EditWorkerModel:FC<Props> = ({editEmployee,onclose}) => {
    console.log(editEmployee);
    // const [preview, setPreview] = useState<string>('');

    const [formData,setFormData]=useState<EmployeeStateTypes>({

        id:editEmployee.id,
        username:editEmployee.username,
        email:editEmployee.email,
        phone:editEmployee.phone,
        skills:editEmployee.skills,
        experience:editEmployee.experience,
        profilePic:editEmployee.profilePic,
        location:editEmployee.location,

    })
    const dispatch:AppDispatch=useDispatch()
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    //  const navigate=useNavigate()
    // useEffect(()=>{
    //      if (isError) {
    //             toast.error(message);
    //             return;
    //           }
    //           if (isSuccess) {
                
    //             // navigate("/admin/mechanics");
            
    //           }
    //           return () => {
    //             dispatch(reset());
    //           };
    // },[isError,isSuccess,dispatch,message,navigate])
    

    const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));

      };
    
       
      
//     const profilepicurl=editEmployee.profile_pic?`http://localhost:3001/uploads/${editEmployee.profile_pic}`
// :"https://via.placeholder.com/150"
//     const handleProfilePic=(e:ChangeEvent<HTMLInputElement>)=>{
    
//         const file = e.target.files ? e.target.files[0] : null;
//           if (file) {
//             setFormData((prevState) => ({ 
//               ...prevState,
//               profile_pic: file 
//               }
//               ));


const validateForm = () => {
  const  tempErrors: { [key: string]: string } = {};
  if (!formData.username.trim()) tempErrors.username = "Username is required";
  if (formData.experience<0) tempErrors.experience = "Experience is required";
  if (!String(formData.skills).trim()) tempErrors.skills = "Skills are required";

  setErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};
              
    
    
            // Display a preview
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //       setPreview(reader.result as string);
        //     };
        //     reader.readAsDataURL(file);
        //   }
    
        // }
        
        
    
      const handleSave = () => {
        // Trigger save logic
        // onSave(formData);


        console.log(formData);
        if (!validateForm()) return
        dispatch(Admin_edit_employee_put(formData)).unwrap()
        .then((updatedData)=> {
            console.log("succes",updatedData);
            dispatch(updateEmployee(updatedData))
            onclose()
            // navigate('/admin/mechanics')
        })
        .catch((err)=>console.log('error for editign',err)
        )
       

        
        // setIsModalOpen(false);
      };
  return (
    <>
    
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>
          
           
        <form>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Email (Readonly) */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Experience */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
          </div>

          {/* Skills */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
          </div>
        </form>
            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onclose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      
    </>
  )
}

export default EditWorkerModel
