import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/black-logo2.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();

  const dispatch = useDispatch();

  const { loading, error, message, isAuthenticated, } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(token, formData));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }


  return (

    <>
      <div className="flex flex-col justify-center md:flex-row h-screen bg-gray-300">
        {/* LEFT SECTION */}
        <div className="w-full md:w-2/3 flex items-center justify-center bg-gray-300 p-5 relative">
          <Link
            to={"/password/forgot"}
            className="border-2 border-[#DDB287] rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 bg-[#156662] text-[#E8D1A8] hover:bg-[#125957]
            hover:bg-[#104D4B] hover:text-[#D4A373] transition duration-300 text-end"
          >
            Back
          </Link>
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-5">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-7 overflow-hidden text-[#125957] cursor-pointer">
              Reset Password
            </h1>
            <p className="text-gray-700 text-center mb-7 cursor-pointer">
              Please enter your new password
            </p>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-4 py-3 pr-12 border border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[#125957]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="mb-4 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-3 pr-12 border border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957]"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#125957]"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="border-2 mt-5 border-[#DDB287] 
                w-full font-semibold bg-[#156662] text-[#F5E6C8] py-2 rounded-lg 
                hover:bg-[#104D4B] hover:text-[#D4A373] transition"
                disabled={loading ? true : false}
              >
                RESET PASSWORD
              </button>
            </form>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="hidden w-full md:w-1/3 bg-[#156662] text-[#E8D1A8] md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[450px]">
            <div className="flex justify-center mb-12">
              <img
                src={logo_with_title}
                alt="logo"
                className="mb-12 h-44 w-auto"

              />

            </div>
            <h1 className="text-1xl font-medium text-center mb-16 text-[#DDB287] cursor-pointer max-w-320px max-auto loading-10"
            >
              "Your Premier Digital Library For Borrowing & Reading Books"
            </h1>
          </div>
        </div>

      </div>
    </>
  );
};


export default ResetPassword;
