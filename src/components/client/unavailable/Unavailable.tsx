import { AlertTriangle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MechanicUnavailable = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Mechanics Available</h2>
        <p className="text-gray-600 mb-6">
          Currently, no mechanics are available. Please check back later or try again.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <Home className="mr-2" /> Go Back Home
        </button>
      </div>
    </div>
  );
};

export default MechanicUnavailable;
