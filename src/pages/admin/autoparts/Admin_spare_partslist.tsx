
import AdminHeader from "../../../components/admin/header/AdminHeader";
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import Admin_add_Product from "./Admin_add_Product";
import { FormEvent, useState } from "react";


const Admin_spare_partslist = () => {
    const [isOpen, setIsOpen] = useState(false);


    const handleOpenModal = () => {
      setIsOpen(true);
    };
    
    const handleCloseModal = () => {
      setIsOpen(false);
    };
    
    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      // Add your form submission logic here
      console.log("Product added!");
      handleCloseModal();
    };
  return (
    <>
    


        <div className="flex">
            <AdminSidebar/>
            <div className="flex flex-col w-full">
                <AdminHeader/>


            {
                isOpen ? <Admin_add_Product closeModal={handleCloseModal} submitModal={handleSubmit} />:(


    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Toolbar */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by product name"
          className="p-2 border border-gray-300 rounded-md w-1/3"
        />
        <select className="p-2 border border-gray-300 rounded-md w-1/5">
          <option value="">Category</option>
          <option value="bearing">Bearing</option>
          <option value="engine">Engine</option>
          <option value="air_condition">Air Condition</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleOpenModal}>Add Product</button>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border-b">Product Name</th>
              <th className="p-3 border-b">Category</th>
              <th className="p-3 border-b">Price</th>
              <th className="p-3 border-b">Stock</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Product Row */}
            <tr className="hover:bg-gray-50">
              <td className="p-3 flex items-center">
                <img
                  src="/placeholder-image.jpg"
                  alt="Product"
                  className="w-10 h-10 rounded-md mr-3"
                />
                Black Printed T-Shirt
              </td>
              <td className="p-3">Bearing</td>
              <td className="p-3">₹1000.00</td>
              <td className="p-3">1</td>
              <td className="p-3">
                <span className="bg-red-200 text-red-700 px-2 py-1 rounded-md text-sm">
                  Out of Stock
                </span>
              </td>
              <td className="p-3 space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded-md">Update</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
              </td>
            </tr>
            {/* More rows can be added dynamically */}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 text-right text-sm text-gray-600">
        Showing 01–20 of 228
      </div>
    </div>
                )
                
}
    </div>
    </div>
</>
  );
};



export default Admin_spare_partslist