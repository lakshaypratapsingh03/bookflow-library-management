import { useEffect, useState } from "react";
import logo from "../assets/black-logo2.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  COURSE_CATALOG,
  getCourseByName,
  getSemesterOptions,
} from "../utils/courses.js";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseName, setCourseName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [semester, setSemester] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const navigateTo = useNavigate();
  const selectedCourse = getCourseByName(courseName);
  const semesterOptions = getSemesterOptions(courseName);

  const handleCourseChange = (nameValue) => {
    setCourseName(nameValue);
    setSemester("");
    const course = getCourseByName(nameValue);
    if (course?.specializations?.length === 1) {
      setSpecialization(course.specializations[0].value);
    } else {
      setSpecialization("");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(
      register({
        name,
        email,
        password,
        course: specialization,
        semester: Number(semester),
      })
    );
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigateTo(`/otp-verification/${email}`)
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, email, message, navigateTo]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }


  return <>

    <div className="flex flex-col justify-center bg-gray-300 
    md:flex-row h-screen">
      {/* LEFT SIDE */}
      <div className="hidden w-full md:w-1/3 bg-[#156662] text-[#F5E6C8] md:flex flex-col items-center 
        justify-center p-8 rounded-tr-[80px] rounded-br-[80px]"
      >
        <div className="text-center h-[400px]">
          <div className="flex justify-center mb-3">
            <img src={logo_with_title} alt="logo"
              className="mb-10 h-44 w-auto" />
          </div>
          <p className="text-[#DDB287] mb-16">Already have Account? Log in now.</p>
          <Link 
          to={"/login"} 
          className="border-2 mt-5 border-[#DDB287] px-8 w-full font-semibold bg-[#EAC9AA] text-[#104D4B] py-2 
          rounded-lg hover:bg-[#104D4B] hover:text-[#D4A373] transition"
          >
          LOG IN
          
          </Link>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="w-full md:w-2/3 flex items-center  bg-gray-300 p-8 justify-center relative">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-7">
            <div className="flex flex-col-reversed sm:flex-row items-center justify-center gap-5 cursor-pointer">
              <h3 className="font-medium text-4xl overflow-hidden text-[#125957]">Sign Up</h3>
              <img src={logo} alt="logo " className="h-24 w-auto object-cover" />
            </div>
          </div>




          <p className="text-gray-700 text-semibold text-center mb-7 cursor-pointer">
            Please provide information to sign up 
            <p className="text-gray-700 text-semibold text-center cursor-pointer">
              only for users</p>
          </p>
          <form onSubmit={handleRegister}>
            <div className="mb-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 border 
              border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957]"
              />
            </div>

            <div className="mb-2">
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

           <div className="mb-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 border border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957]"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#125957]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

            <div className="mb-2">
              <select
                value={courseName}
                onChange={(e) => handleCourseChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957]"
              >
                <option value="">Select Course</option>
                {COURSE_CATALOG.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} ({item.duration})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <select
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setSemester("");
                }}
                required
                disabled={!courseName}
                className="w-full px-4 py-3 border border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957] disabled:opacity-60"
              >
                <option value="">Select Specialization</option>
                {selectedCourse?.specializations.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                disabled={!specialization}
                className="w-full px-4 py-3 border border-[#DDB287] hover:border-[#125957] rounded-md focus:outline-none bg-[#FAF1EA] text-[#125957] disabled:opacity-60"
              >
                <option value="">Select Semester</option>
                {semesterOptions.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="block md:hidden font-semibold mt-5">
              <p>Already have Account?
                <Link to="/login" className="text-sm 
                text-gray-500 hover:underline">Sign In</Link>
              </p>
            </div>
            <button type="submit" className="border-2 mt-6 border-[#DDB287]
            w-full font-semibold bg-[#156662] text-[#E8D1A8] py-2 rounded-lg 
            hover:bg-[#104D4B] hover:text-[#D4A373] transition">
              SIGN UP
            </button>
          </form>

        </div>
      </div>
    </div>


  </>;
};

export default Register;
