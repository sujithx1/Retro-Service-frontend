import { ChangeEvent, FormEvent, useState } from "react";

const StoreRegistration = () => {
  const [store, setStore] = useState({
    name: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!store.name) newErrors.name = "Store Name is required";
    if (!store.ownerName) newErrors.ownerName = "Owner Name is required";
    if (!store.ownerEmail) newErrors.ownerEmail = "Owner Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.ownerEmail)) newErrors.ownerEmail = "Invalid email format";
    if (!store.ownerPhone) newErrors.ownerPhone = "Owner Phone is required";
    else if (!/^\d{10}$/.test(store.ownerPhone)) newErrors.ownerPhone = "Invalid phone number";
    if (!store.password) newErrors.password = "Password is required";
    if (store.password !== store.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStore({
      ...store,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Store Data:", store);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('/storebackground.jpeg')" }}>
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl border border-gray-300 backdrop-blur-md bg-opacity-90">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Store Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input type="text" name="name" placeholder="Store Name" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <input type="text" name="ownerName" placeholder="Owner Name" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName}</p>}
          </div>
          <div>
            <input type="email" name="ownerEmail" placeholder="Owner Email" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.ownerEmail && <p className="text-red-500 text-sm">{errors.ownerEmail}</p>}
          </div>
          <div>
            <input type="text" name="ownerPhone" placeholder="Owner Phone" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.ownerPhone && <p className="text-red-500 text-sm">{errors.ownerPhone}</p>}
          </div>
          <div>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          
          <button type="submit" className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition shadow-md">Register Store</button>
        </form>
      </div>
    </div>
  );
};

export default StoreRegistration;
