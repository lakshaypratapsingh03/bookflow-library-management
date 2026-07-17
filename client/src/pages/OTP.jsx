import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo2.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useParams, Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated, } = useSelector(state => state.auth);


  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };



  useEffect(() => {
    // if (message) {
    //toast.success(message);
    //}
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
        <div className="w-full md:w-2/3 flex items-center bg-gray-300 p-8 justify-center relative">
          <Link
            to={"/register"}
            className="border-2 border-[#DDB287] rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 bg-[#156662] text-[#E8D1A8] hover:bg-[#125957]
            hover:bg-[#104D4B] hover:text-[#D4A373] transition duration-300 text-end"
          >
            Back
          </Link>
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-4">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-7 overflow-hidden text-[#125957]">
              Check your Email
            </h1>
            <p className="text-gray-700 text-center mb-7">Please enter the otp to proceed</p>
            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <div className="mb-6 flex justify-center">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={5}
                    renderInput={(props) => <input {...props} />}
                    containerStyle="flex gap-3"
                    inputStyle={{
                      width: "50px",
                      height: "50px",
                      border: "none",
                      borderBottom: "2px solid #156662",
                      background: "transparent",
                      fontSize: "24px",
                      textAlign: "center",
                      color: "#D4A373",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="border-2 mt-5 border-[#DDB287] 
                w-full font-semibold bg-[#156662] text-[#E8D1A8] py-2 rounded-lg 
                hover:bg-[#104D4B] hover:text-[#D4A373] transition"
              >VERIFY</button>
            </form>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="hidden w-full md:w-1/3 bg-[#156662] text-[#F5E6C8] md:flex flex-col items-center 
        justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[400px]">
            <div className="flex justify-center mb:12">
              <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
            </div>
            <p className="text-[#DDB287] mb-12">New to our platform? Sign up now.</p>
            <Link
              to={"/register"}
              className="border-2 mt-5 border-[#DDB287] px-8 w-full font-semibold bg-[#EAC9AA] text-[#104D4B] py-2 
              rounded-lg hover:bg-[#104D4B] hover:text-[#D4A373] transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </>
  );

};

export default OTP;
