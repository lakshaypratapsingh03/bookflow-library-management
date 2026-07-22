import { useEffect, useState } from "react";
import logo from "../assets/black-logo2.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFaceChallenge,
  faceOnlyLogin,
  login,
  resetAuthSlice,
} from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Navigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FaceCapture from "../components/FaceCapture";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState(null);
  const [role, setRole] = useState("User");
  const primaryColor = "#156662";
  const borderColor = "#DDB287";
  const bgColor = "#EAC9AA";

  const dispatch = useDispatch();

  const { loading, error, isAuthenticated, message } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password, role }));
  };

  const handleFaceOnlyCapture = async (descriptor) => {
    if (!email.trim()) {
      toast.error("Enter your email before capturing your face.");
      return;
    }
    await dispatch(faceOnlyLogin(email.trim(), descriptor));
  };

  useEffect(() => {
    dispatch(clearFaceChallenge());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (message && isAuthenticated) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, message, isAuthenticated]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  const modeButtonClass = (active) =>
    `flex-1 py-2 rounded-md font-semibold border-2 ${active
      ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
      : "bg-gray-500 text-[#EAC9AA] border-[#DDB287]"
    }`;

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen bg-gray-300">
        <div className="w-full md:w-2/3 flex items-center bg-gray-300 p-8 justify-center relative">
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-4">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-7 overflow-hidden text-[#125957] cursor-pointer">
              {loginMode === "face"
                ? "Face Login"
                : loginMode === "email"
                  ? "Email Login"
                  : "Welcome Back !!"}
            </h1>
            <p className="text-gray-700 text-center mb-4">
              {loginMode === "face"
                ? "Enter your email, then capture your face."
                : loginMode === "email"
                  ? "Sign in with your email and password."
                  : "Choose how you want to sign in."}
            </p>

            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setLoginMode("email")}
                className={modeButtonClass(loginMode === "email")}
              >
                Email Login
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("face")}
                className={modeButtonClass(loginMode === "face")}
              >
                Face Only
              </button>
            </div>

            {loginMode === "face" && (
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957]"
                  autoComplete="username"
                />

                <FaceCapture
                  onCapture={handleFaceOnlyCapture}
                  captureLabel="Login with Face"
                  disabled={loading || !email.trim()}
                />
                <p className="font-semibold text-[#d67412]">
                  Face login must already be enabled in Settings for this
                  account.
                </p>
              </div>
            )}

            {loginMode === "email" && (
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <input
                    type="email"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 border 
                    border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957]"
                    autoComplete="username"
                  />
                </div>
                <div className="mb-4 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 pr-12 border border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957]"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#125957]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <Link
                  to={"/password/forgot"}
                  className="font-semibold  text-[#d67412] hover:underline hover:text-[#104D4B] transition"
                >
                  Forgot Password?
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="border-2 mt-5 border-[#DDB287] 
                w-full font-semibold bg-[#156662] text-[#F5E6C8] py-2 rounded-lg 
                hover:bg-[#104D4B] hover:text-[#D4A373] transition disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "LOGIN"}
                </button>

                {/* Role */}
                <div className="mb-4">
                  <label className="block font-semibold text-[#d67412] mb-4 mt-4">Role</label>
                  <div className="flex gap-2">
                    {[
                      { label: "User", value: "User" },
                      { label: "Librarian", value: "Librarian" },
                      { label: "Admin", value: "Admin" },
                    ].map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors bg-gray-500 cursor-pointer"
                        onClick={() => setRole(r.value)}
                        style={
                          role === r.value
                            ? { backgroundColor: primaryColor, color: bgColor }
                            : { border: `1px solid ${borderColor}`, color: "#EAC9AA" }
                        }
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        <div
          className="hidden w-full md:w-1/3 bg-[#156662] text-[#F5E6C8] md:flex flex-col items-center 
        justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]"
        >
          <div className="text-center h-[400px]">
            <div className="flex justify-center mb-3">
              <img
                src={logo_with_title}
                alt="logo"
                className="mb-10 h-44 w-auto"
              />
            </div>
            <p className="text-[#DDB287] mb-16">
              New to our platform? Sign up now.
            </p>
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

export default Login;
