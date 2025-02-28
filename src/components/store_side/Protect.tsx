import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../store/store";

interface Props {
  children: React.ReactNode;
}

const StoreProtect: FC<Props> = ({ children }) => {

  const { store} = useSelector((state: RootState) => state.store);
  console.log("store",store);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!store && location.pathname !== "/store/login" && location.pathname !== "/store/signup") {
      navigate("/store/login");
    } else if (store && (location.pathname === "/store/login" || location.pathname === "/store/signup")) {
      navigate("/home"); // Redirect to home or dashboard if already logged in
    }
  }, [navigate, store, location.pathname]);

  if (!store && location.pathname !== "/store/login" && location.pathname !== "/store/signup") {
    return null;
  }

  return <>{children}</>;
};

export default StoreProtect;
