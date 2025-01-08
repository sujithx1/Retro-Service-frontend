import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { Admin_Get_FeedBack } from "../../../reducers/admin/adminapicalls";
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar";
import AdminHeader from "../../../components/admin/header/AdminHeader";

const AdminReportFeedbackList: React.FC = () => {
    const dispatch:AppDispatch=useDispatch()
       useEffect(()=>{
           dispatch(Admin_Get_FeedBack())
   
       },[dispatch])
const {feedbacks}=useSelector((state:RootState)=>state.admin)



//   const placeholderData = [
//     {
//       id: "1",
//       userName: "John Doe",
//       userEmail: "john.doe@example.com",
//       userFeedBack: "Great service, but improvement needed in response time.",
//       employeeId: "EMP123",
//       createdAt: "2024-12-01T10:00:00Z",
//     },
//     {
//       id: "2",
//       userName: "Jane Smith",
//       userEmail: "jane.smith@example.com",
//       userFeedBack: "Excellent experience with the mechanic!",
//       employeeId: "EMP456",
//       createdAt: "2024-12-02T12:30:00Z",
//     },
//   ];

  return (
    <div className="flex">
    <AdminSidebar/>
    <div className="flex flex-col w-full">
        <AdminHeader/>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Feedback Reports</h1>

      <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">User Name</th>
            <th className="px-4 py-2">User Email</th>
            <th className="px-4 py-2">Feedback</th>
            <th className="px-4 py-2">Employee Email</th>
            <th className="px-4 py-2">Created At</th>
            {/* <th className="px-4 py-2">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback,index) => (
            <tr key={feedback.id} className="text-gray-700 border-b">
              <td className="px-4 py-2">{index+1}</td>
              <td className="px-4 py-2">{feedback.name}</td>
              <td className="px-4 py-2">{feedback.userEmail}</td>
              <td className="px-4 py-2">{feedback.feedBack}</td>
              <td className="px-4 py-2">{feedback.employeeEmail}</td>
              <td className="px-4 py-2">
                {new Date(feedback.createdAt||"").toLocaleString()||""}
              </td>
              {/* <td className="px-4 py-2">
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
};

export default AdminReportFeedbackList;
