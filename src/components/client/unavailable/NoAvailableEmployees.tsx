import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

interface NoAvailableEmployeesProps {
  message?: string;
  delay?: number; // Time before redirect (default 3 seconds)
}

const NoAvailableEmployees: React.FC<NoAvailableEmployeesProps> = ({
  message = "Sorry No Employees are found . Redirecting to home...",
  delay = 3000,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, delay]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">{message}</h2>
        <p className="text-gray-600 mt-2">You will be redirected shortly...</p>
      </div>
    </div>
  );
};

export default NoAvailableEmployees;
