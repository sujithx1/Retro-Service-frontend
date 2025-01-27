import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { FC, ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

const Emp_protecter: FC<Props> = ({ children }) => {
  const { employee } = useSelector((state: RootState) => state.employee);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!employee && location.pathname !== "/employee/login" && location.pathname !== "/employee/signup") {
      navigate("/employee/login");
    } else if (employee && (location.pathname === "/employee/login" || location.pathname === "/employee/signup")) {
      navigate("/employee/home"); // Redirect to home or dashboard if already logged in
    }
  }, [navigate, employee, location.pathname]);

  if (!employee && location.pathname !== "/employee/login" && location.pathname !== "/employee/signup") {
    return null;
  }

  return <>{children}</>;
};

export default Emp_protecter;
