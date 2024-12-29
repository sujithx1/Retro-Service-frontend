import { NavLink } from "react-router-dom";


const Emp_Sidebar = () => 
    {
        const urls=[
            {side:'Dashboard' ,icon: "🏠" ,path:'/employee/home'},
            {side:'Jobs' ,icon:"🛠️" , path:'/employee/jobs'},
            {side:'Users' ,   icon:"👨‍👩‍👧",  path:'/employe/users'},
            {side:'Booking' ,  icon:"🧑‍🔧", path:'/employee/booking'},
            // {side:'Categories' ,path:'/admin/categories'},
        ]


        return(

          
    <aside className="bg-slate-200 w-64  h-screen flex flex-col">
      <div className="p-4 text-2xl font-bold">
        <span className="text-blue-700">
            Retro
            </span>
            <span>

            Service
            </span>
            </div>
      <nav className="flex flex-col space-y-4 p-4">
        {urls.map((item,index)=>(

            <NavLink
            className={`flex items-center space-x-2 hover:bg-white p-2 rounded no-underline font-bold text-sm `}
            key={index}
          
            to={item.path}
            >
                <span>{item.icon}</span>
                <span>{item.side}</span>




            </NavLink>
            
        // <a href="#" className="flex items-center space-x-2 hover:bg-white p-2 rounded no-underline">
        //   <span>🏠</span>
        //   <span >Dashboard</span>
        // </a>
        ))}
       
        {/* Add more links as needed */}
      </nav>
    </aside>
  );
  }

  export default Emp_Sidebar