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
    if (!user && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate("/login");
    } else if (user && (location.pathname === "/login" || location.pathname === "/signup")) {
      navigate("/home"); // Redirect to home or dashboard if already logged in
    }
  }, [navigate, user, location.pathname]);

  if (!user && location.pathname !== "/login" && location.pathname !== "/signup") {
    return null;
  }

  return <>{children}</>;
};

export default UserProtect;
