import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { Employee_EditProfile_types } from "../../../types/employee/EmployeeTypes";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Employee_put_Profile } from "../../../reducers/employees/EmployeeApicalls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { empReset } from "../../../reducers/employees/EmployeeReducers";
import { toast } from "react-toastify";
// import { Admin_get_a
// \llJobs } from "../../../reducers/admin/adminapicalls";

const Profile_Employee = () => {

    const {employee,isError,message}=useSelector((state:RootState)=>state.employee)
    // const {jobs}=useSelector((state:RootState)=>state.admin)
    console.log(employee);


    const [Emp_Edit, setEmp_Edit] = useState<Employee_EditProfile_types>({
       id: employee?.id||"",
       username: employee?.username||"",
       email: employee?.email,
       phone:employee?.phone|| "",
       profilePic:employee?.profilePic||"",
    //    skills:employee?.skills||[],
       experience:employee?.experience ||"",
       location:employee?.location||""
       
    });
    const dispatch:AppDispatch=useDispatch()

     const navigate=useNavigate()

     useEffect(()=>{

        // dispatch(Admin_get_allJobs())
        // if(isSuccess)
        // {
        //     navigate('/employee/home')
        //     dispatch(empReset())
        //     return
        // }
      

        if(isError)
        {
            toast.error(message)
            dispatch(empReset())
            return
    
        }
      
            
      },[ isError, message, dispatch, navigate  ])
    


  

    const profilepicurl = employee?.profilePic
    ? `${employee.profilePic}`
    : "https://via.placeholder.com/150";

 const [preview, setPreview] = useState<string>("");
  
//  const [newSkill, setNewSkill] = useState<string>("");

  const handle_ProfilePic = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;

      console.log("Selected profile picture file:", file);
    if (file) {
   

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

     

    
    }
   


  }

   const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEmp_Edit((prev) => ({
        ...prev,
        [name]: value,
      }));
    };


    // const handleAddSkill = () => {
    //     if (newSkill && !Emp_Edit.skills.includes(newSkill)) {
    //       setEmp_Edit((prev) => ({
    //         ...prev,
    //         skills: [...prev.skills,newSkill],
    //       }));
    //       setNewSkill("");
    //     } else {
    //       toast.error("Skill already exists or is empty!");
    //     }
    //   };
    

     const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    
        console.log(Emp_Edit);
        if (preview) {
          Emp_Edit.profilePic=preview
          
        }else
        {
          Emp_Edit.profilePic=Emp_Edit?.profilePic as string
        }
        const UpdateUserData = {
          
            
                ...Emp_Edit,
            
              
            
            
        
        };
      //  if (preview) {
      //   console.log("previewwwww",preview);
        
      //  }
        
        console.log("Updated user data:", UpdateUserData);
        dispatch(Employee_put_Profile(UpdateUserData)).unwrap()
        .then(()=>
          {  
            toast.success("updated")
            // navigate('/employee/home')
        })
      };
  return (
    <>
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <img
              src={preview || profilepicurl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            <label
              htmlFor="file-upload"
              className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition duration-200"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="text-white" />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handle_ProfilePic}
              className="hidden"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Edit Profile</h1>
        </div>

        {/* Editable Profile Information */}
        <div className="mt-6 space-y-4">
          <input
            type="text"
            name="username"
            value={Emp_Edit.username}
            onChange={handleOnchange}
            className="w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
            placeholder="Enter your name"
          />
          <input
            type="email"
            name="email"
            value={Emp_Edit.email}
            readOnly
            className="w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
          />
          <input
            type="tel"
            name="phone"
            value={Emp_Edit.phone}
            onChange={handleOnchange}
            className="w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
            placeholder="Enter your phone number"
          />
          {/* <input
            type="text"
            name="skills"
            value={Emp_Edit.skills}
            onChange={handleOnchange}
            className="w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
            placeholder="Enter your skills"
          /> */}
          {/* <div className="relative">
              <select
                name="skills"
                value=""
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
              >
                <option value="">Select a skill...</option>
                {jobs.map((skill, index) => (
                  <option key={index} value={skill.name}>
                    {skill.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSkill}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
              >
                Add Skill
              </button>
            </div>

            <div className="mt-2 text-gray-600">
              <strong>Current Skills:</strong>
              <ul>
                {Emp_Edit.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div> */}
          <input
            type="text"
            name="experience"
            value={Emp_Edit.experience}
            onChange={handleOnchange}
            className="w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
            placeholder="Enter your experience"
          />
          <input
            type="text"
            name="location"
            value={Emp_Edit.location}
            onChange={handleOnchange}
            className="w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
            placeholder="Enter your location"
          />
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    
    </>
  )
}

export default Profile_Employee