import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { UserGoogle_post } from "../../../reducers/users/UserapiCalls";

const GoogleLoginUser = () => {
    const dispatch:AppDispatch =useDispatch()
    const handleSuccess = async (response:  CredentialResponse) => {
        try {
          const { credential } = response;
          if(!credential) throw new Error("no credential")
        const res=await dispatch(UserGoogle_post(credential))
          console.log('Server Response:', res);
        } catch (error) {
          console.error('Error during Google authentication:', error);
        }
    }
  return (
    <div className="flex items-center justify-center mt-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google login error")}
        theme="outline" // You can use "filled_blue", "filled_black", or "outline"
        size="large"    // Options: "small", "medium", "large"
        logo_alignment="center" // Align logo to the center or left
        shape="pill"    // Options: "pill" or "rectangular"
      />
    </div>
  );
};

export default GoogleLoginUser;
