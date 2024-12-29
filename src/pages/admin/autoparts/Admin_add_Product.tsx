import { FC, FormEvent } from "react";


interface Props{
    closeModal:()=>void
    submitModal:(e:FormEvent)=>void
}
const Admin_add_Product:FC<Props> = ({closeModal,submitModal}) => {
  
  return (
   <>
  
    <div>
      {/* Add Product Button */}
      {/* <button
        onClick={handleOpenModal}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Add Product
      </button> */}

      {/* Modal */}
    
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/2 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitModal}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Category
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="bearing">Bearing</option>
                    <option value="engine">Engine</option>
                    <option value="air_condition">Air Condition</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Stock
                  </label>
                  <input
                    type="number"
                    placeholder="Enter stock quantity"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">
                    Upload Product Image
                  </label>
                  <input
                    type="file"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter product description"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
 
    </div>

   </>
  )
}

export default Admin_add_Product