import React from "react";
import { FaBell, FaComments, FaUser, FaWallet } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const StoreHeader: React.FC = () => {
    const {store}=useSelector((state:RootState)=>state.store)
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 {store&& store.name }</h1>
        <div className="flex items-center gap-4">
          <FaWallet className="text-2xl cursor-pointer" />
          <FaComments className="text-2xl cursor-pointer" />
          <FaBell className="text-2xl cursor-pointer" />
          <FaUser className="text-2xl cursor-pointer" />
        </div>
      </header>
    );
  };
  export default StoreHeader