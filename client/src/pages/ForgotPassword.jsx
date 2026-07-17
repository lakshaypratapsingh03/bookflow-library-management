import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo2.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Navigate, Link } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated, } = useSelector(
    (state) => state.auth
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  }

  useEffect(() => {
     if (message) {
       toast.success(message);
       dispatch(resetAuthSlice());
     }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen bg-gray-300">
        {/* LEFT SIDE */}
        <div className="hidden w-full md:w-1/3 bg-[#156662] text-[#E8D1A8] md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        
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
        {/* RIGHT SIDE */}
        <div className="w-full md:w-2/3 flex items-center justify-center bg-gray-300 p-5 relative">
          <Link
            to={"/login"}
            className="border-2 border-[#DDB287] rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -right-28 bg-[#156662] text-[#E8D1A8] hover:bg-[#125957]
            hover:bg-[#104D4B] hover:text-[#D4A373] transition duration-300 text-start"
          >
            Back
          </Link>
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-3">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto mb-2" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-7 overflow-hidden text-[#125957] cursor-pointer">
              Forgot Password
            </h1>
            <p className="text-gray-700 text-center mb-7 cursor-pointer"></p>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <input
                  type="email"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Please enter your email"
                  className="w-full px-4 py-3 border 
                    border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957]"
                  autoComplete="username"
                />
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
      </div>

    </>
  );
};

export default ForgotPassword;
