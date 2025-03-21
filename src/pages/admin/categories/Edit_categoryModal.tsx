import  { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { CategoryStateTypes } from "../../../types/admin/admintypes";
import { useDispatch} from "react-redux";
import { AppDispatch } from "../../../store/store";
import {  updateCategory } from "../../../reducers/admin/adminReducers";
import { Admin_put_category } from "../../../reducers/admin/adminapicalls";



interface EditCategoryModalProps {

  onClose: () => void;
  Category:CategoryStateTypes
 
  
}



const EditCategoryModal: FC<EditCategoryModalProps> = ({
  
  onClose,
  Category
  
}) => {
  const [formValues, setFormValues] = useState<CategoryStateTypes>({
    id:"",
    name: "",
    description: "",
  });

  const dispatch:AppDispatch=useDispatch()
// const {isError,message}=useSelector((state:RootState)=>state.admin)
 useEffect(()=>{
    if (Category) {
        setFormValues(Category)
        
    }
 

 },[Category,dispatch])
 const [errors, setErrors] = useState<{ name: string; description: string }>({ name: "", description: "" });
 
 const validate = () => {
  const newErrors: { name?: string; description?: string; minimum_wage?: string } = {}; // ✅ Use optional keys
  if (!formValues.name.trim()) newErrors.name = "Category name is required.";
  if (!formValues.description.trim()) newErrors.description = "Description is required.";

  setErrors({ 
    name: newErrors.name || "", 
    description: newErrors.description || "", 
  });      
  return Object.keys(newErrors).length === 0; // Return true if no errors
};


 const handleOnchChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const{name,value}=e.target
    setFormValues((prev)=>({
        ...prev,
        [name]:value
    }))
    setErrors((prev) => ({ ...prev, [name]: "" }));


  }

  const handleSubmit=(e:FormEvent)=>{

    e.preventDefault()
    if (!validate()) return;

    dispatch(Admin_put_category(formValues))
    .unwrap()
    .then((updateData)=>{
        updateCategory(updateData)
        onClose()

    })
    .catch((err)=>console.log("error",err)
    )


  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Edit Category</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleOnchChange}
            placeholder="Category Name"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="text"
            name="description"
            value={formValues.description}
            onChange={handleOnchChange}
            placeholder="Category Description"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

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
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
