import { ChangeEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import AdminHeader from "../../../components/admin/header/AdminHeader";
import { Add_category, CategoryStateTypes } from "../../../types/admin/admintypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { Admin_add_category, Admin_del_Category, Admin_get_allCategories } from "../../../reducers/admin/adminapicalls";
import { toast } from "react-toastify";
import { reset } from "../../../reducers/admin/adminReducers";
import EditCategoryModal from "./Edit_categoryModal";

const Admin_Categories = () => {


    
    
    
      const [newCategory, setNewCategory] = useState<Add_category>({ name: "", description:"" });
      const dispatch:AppDispatch=useDispatch()
      const {categories,isError,message}=useSelector((state:RootState)=>state.admin)
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editCategory,setEditCategory]=useState<CategoryStateTypes>({
        id:"",
        name:"",
        description:""
        
      })
      const handleEditCategory = (category: CategoryStateTypes) => {
        setEditCategory(category);
        setIsModalOpen(true);
      };


      // 
    
      useEffect(()=>{
        if (isError) {
          console.log(message);
          
          toast.error(message)
          dispatch(reset())
          return
        }
        dispatch(Admin_get_allCategories())

      },[isError,message,dispatch])
      const handleOnchChange = (e:ChangeEvent<HTMLInputElement>) => {
       
        const {name,value}=e.target
          setNewCategory((prev)=>({

            ...prev,
           
            [name]:value

          })); 
        
      };

      const handleSubmit=()=>{
        console.log(newCategory);
        dispatch(Admin_add_category(newCategory))
        setNewCategory({name:"",description:""})
        

      }
    
      const handleDeleteCategory = (id: string) => {
        dispatch(Admin_del_Category(id))
      };
    
      
  return (
    <> {
      isModalOpen &&
  <EditCategoryModal
          
          onClose={() => setIsModalOpen(false)}
          Category={editCategory}
          
        />
    }
   <div className="flex bg-gray-100 min-h-screen">
  <AdminSidebar />
  <div className="flex flex-col w-full">
    <AdminHeader />

    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Title */}

      {/* Container for List and Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories List Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-xl font-semibold mb-6 text-gray-700 text-center">
    Categories List
  </h2>
  {categories.length > 0 ? (
    <ul className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {categories.map((category) => (
        <li
          key={category.id}
          className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          {/* Category Details */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500">
              {category.description}
            </p>
          </div>
          
          {/* Status */}
          <p
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              category.isBlock
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {category.isBlock ? "Not Active" : "Active"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              className="text-blue-600 font-medium hover:underline focus:outline-none"
              // onClick={() => handleEditCategory(category)}
              onClick={() => handleEditCategory(category)}
            >
              Edit
            </button>
            <button
              className="text-red-600 font-medium hover:underline focus:outline-none"
              onClick={() => handleDeleteCategory(category.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 text-center">
      No categories added yet. Start by adding a new category!
    </p>
  )}
 

</div>

        {/* Add Category Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Add New Category
          </h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              name="name"
              value={newCategory.name}
              onChange={handleOnchChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              name="description"
              value={newCategory.description}
              onChange={handleOnchChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

 
    
    
    </>
  )
}

export default Admin_Categories