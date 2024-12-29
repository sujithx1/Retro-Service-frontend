import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { FC, ReactNode, useEffect } from "react";
interface Props {
  children: ReactNode;
}
const UserProtect: FC<Props> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate, user]);
  if (!user) {
    return null;
  }
  return <>{children}</>;
};

export default UserProtect;
