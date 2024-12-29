import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { FC, ReactNode, useEffect } from "react";
interface Props {
  children: ReactNode;
}

const Emp_protecter:FC<Props> = ({children}) => {
    const { employee } = useSelector((state: RootState) => state.employee);
    const navigate = useNavigate();
    useEffect(() => {
      if (!employee && location.pathname !== "/employee/login") {
        navigate("/employee/login");
      }
    }, [navigate, employee]);
    if (!employee) {
      return null;
    }
    return <>{children}</>;
  };

export default Emp_protecter