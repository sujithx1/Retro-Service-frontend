import { EmployeeStateTypes } from "../../../types/employee/EmployeeTypes";

interface EmployeeProps {
    employee: EmployeeStateTypes;
    onApprove: (id: string, isValidated: boolean) => void;
  }
  
  const EmployeeCard = ({ employee, onApprove }: EmployeeProps) => {
    return (
      <div className="border p-4 rounded-md shadow-md bg-white">
        <h2 className="text-lg font-bold">{employee.username}</h2>
        <p>Email: {employee.email}</p>
        <p>Phone: {employee.phone}</p>
        <p>Experience: {employee.experience} years</p>
  
        {employee.proof ? (
          <div>
            <p className="font-bold mt-2">Proof Document:</p>
            <img src={employee.proof} alt="Proof" className="w-32 h-32 object-cover border rounded" />
          </div>
        ) : (
          <p className="text-red-500">No proof uploaded</p>
        )}
  
        <div className="mt-3">
          <button
            onClick={() => onApprove(employee.id, true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => onApprove(employee.id, false)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            No
          </button>
        </div>
      </div>
    );
  };

  export default EmployeeCard
  