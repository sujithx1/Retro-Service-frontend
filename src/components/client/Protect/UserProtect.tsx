import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../../store/store";

interface Props {
  children: React.ReactNode;
}

const UserProtect: FC<Props> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login");
    } else if (user && location.pathname === "/login") {
      navigate("/home"); // Redirect to home or dashboard if already logged in
    }
  }, [navigate, user, location.pathname]);

  if (!user && location.pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
};

export default UserProtect;
