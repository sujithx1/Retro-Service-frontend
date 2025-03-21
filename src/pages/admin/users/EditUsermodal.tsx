import { ChangeEvent, FC, useEffect, useState } from "react";
import { UserStateTypes } from "../../../types/clients/UsersTypes";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Admin_edit_users_put } from "../../../reducers/admin/adminapicalls";
import { updateUsers } from "../../../reducers/admin/adminReducers";
import { toast } from "react-toastify";
interface Props{
    users:UserStateTypes;
    onclose:()=>void
}
const EditUsermodal:FC<Props> = ({users,onclose}) => {



  const [errors, setErrors] = useState<Record<string, string>>({});


        const [formData,setFormData]=useState<UserStateTypes>({
    
            id:users.id,
            username:users.username,
            email:users.email,
            phone:users.phone,
           profilePic:users.profilePic,
          
    
        })
        const dispatch:AppDispatch=useDispatch()


        const validateForm = () => {
          const tempErrors: Record<string, string> = {};
          if (!formData.username.trim()) tempErrors.username = "Username is required";
          if (formData.phone.length !== 10) tempErrors.phone = "Enter a valid phone number";
        
          setErrors(tempErrors);
          return Object.keys(tempErrors).length === 0; // Return true if no errors
        };
             
 
     const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
         const { name, value } = e.target;
         setFormData((prev) => ({ ...prev, [name]: value }));
         setErrors((prev) => ({ ...prev, [name]: "" }));

       };

       const {isError,message}=useSelector((state:RootState)=>state.admin)
       
       useEffect(()=>{
        if (isError) {
          toast.error(message)
          return
          
        }
        
       })
             const handleSave = () => {
               // Trigger save logic
               // onSave(formData);
                              console.log(formData);

               if (!validateForm()) return
               console.log(formData);


               dispatch(Admin_edit_users_put(formData)).unwrap()
               .then((updatedData)=> {
                   console.log("succes",updatedData);
                   dispatch(updateUsers(updatedData))
                   onclose()
                   // navigate('/admin/mechanics')
               })
               .catch((err)=>{console.log('error for editign',err)
               
               }
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
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

              {/* Email (Readonly) */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                />
              </div>

              {/* Profile Picture */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium">Profile Picture</label>
                <input
                  type="file"

                  onChange={handleFileChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div> */}

              {/* Location */}
           
              <div className="mb-4">
                <label className="block text-sm font-medium">phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

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

export default EditUsermodal