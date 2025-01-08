

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { User_post_forgot_password } from "../../../reducers/users/UserapiCalls";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PasswordForm() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { tempuser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setEmail(tempuser.email);
  }, [tempuser]);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else if (password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      setError("");
      dispatch(User_post_forgot_password({ email, password }))
        .unwrap()
        .then(() => {
          toast.success("Password changed successfully");
          navigate('/login');
        })
        .catch((err) => toast.error(err + " - Password not changed"));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="new-password" className="block text-gray-700 text-sm font-medium mb-2">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              
            />
          </div>
          <div className="mb-5">
            <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-sm flex items-center" role="alert" aria-live="assertive">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
