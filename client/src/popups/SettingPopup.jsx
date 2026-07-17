import { useEffect, useState } from "react";
import closeIcon from "../assets/close-square2.png";
import { useDispatch, useSelector } from "react-redux";
import {
  disableFace,
  enrollFace,
  resetAuthSlice,
  updatePassword,
  updateSemester,
} from "../store/slices/authSlice";
import SettingIcon from "../assets/setting-F5E6C8.png";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FaceCapture from "../components/FaceCapture";
import { isUser } from "../utils/roles.js";
import {
  COURSE_CATALOG,
  getCourseByName,
  getCourseByValue,
  getSemesterOptions,
} from "../utils/courses.js";
import { fetchAllBooks } from "../store/slices/bookSlice";

const SettingPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEnrollCamera, setShowEnrollCamera] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [semester, setSemester] = useState("");

  const dispatch = useDispatch();
  const { loading, user, error, message } = useSelector((state) => state.auth);
  const faceEnabled = Boolean(user?.faceEnabled);
  const selectedCourse = getCourseByName(courseName);
  const semesterOptions = getSemesterOptions(courseName);

  useEffect(() => {
    if (user?.course) {
      const matched = getCourseByValue(user.course);
      setCourseName(matched?.name || "");
      setSpecialization(user.course);
    }
    if (user?.semester) {
      setSemester(String(user.semester));
    }
  }, [user?.course, user?.semester]);

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

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    dispatch(
      updatePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
    );
  };

  const handleUpdateSemester = (e) => {
    e.preventDefault();
    dispatch(updateSemester(specialization, Number(semester)));
  };

  const handleEnrollFace = async (descriptor) => {
    await dispatch(enrollFace(descriptor));
    setShowEnrollCamera(false);
  };

  useEffect(() => {
    if (error) {
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (message) {
      dispatch(resetAuthSlice());
      dispatch(fetchAllBooks());
    }
  }, [dispatch, message]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 p-5 flex items-center justify-center z-50 overflow-y-auto">
      <div className="w-full bg-gray-100 rounded-lg shadow-lg sm:w-auto lg:w-1/2 2xl:w-1/3 my-8">
        <div className="p-6">
          <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-[#bb6d1e]">
            <div className="flex items-center gap-3">
              <img
                src={SettingIcon}
                alt="setting-icon"
                className="bg-[#156662] p-2 rounded-lg"
              />
              <h3 className="text-xl font-bold text-[#bb6d1e]">
                Change Credentials
              </h3>
            </div>
            <img
              src={closeIcon}
              alt="close-icon"
              className="h-9 w-9 cursor-pointer"
              onClick={() => dispatch(toggleSettingPopup())}
            />
          </header>

          <form onSubmit={handleUpdatePassword}>
            <div className="mb-5 sm:flex gap-4 items-center">
              <label className="block text-[#125957] font-medium w-full">
                Enter Current Password
              </label>

              <div className="relative w-full">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  className="w-full px-4 py-2 pr-12 border border-gray-900 rounded-md focus:outline-none text-[#bb6d1e] bg-[#FAF1EA] text-xl"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#125957]"
                >
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mb-5 sm:flex gap-4 items-center">
              <label className="block text-[#125957] font-medium w-full">
                Enter New Password
              </label>

              <div className="relative w-full">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-4 py-2 pr-12 border border-gray-900 rounded-md focus:outline-none text-[#bb6d1e] bg-[#FAF1EA] text-xl"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#125957]"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mb-5 sm:flex gap-4 items-center">
              <label className="block text-[#125957] font-medium w-full">
                Enter Confirm New Password
              </label>

              <div className="relative w-full">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2 pr-12 border border-gray-900 rounded-md focus:outline-none text-[#bb6d1e] bg-[#FAF1EA] text-xl"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#125957]"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#156662] text-[#E8D1A8] rounded-md hover:bg-[#104D4B] hover:text-[#D4A373]"
              >
                CONFIRM
              </button>
              <button
                type="button"
                onClick={() => dispatch(toggleSettingPopup())}
                className="px-4 py-2 bg-gray-500 text-[#EAC9AA] rounded-md hover:bg-gray-700 hover:text-[#D4A373]"
              >
                CANCEL
              </button>
            </div>
          </form>

          {isUser(user?.role) && (
            <section className="mt-10 pt-6 border-t border-[#bb6d1e]">
              <h4 className="text-lg font-bold text-[#bb6d1e] mb-2">
                Course & Semester
              </h4>
              <p className="text-sm text-[#125957] mb-4">
                You will only see books assigned to your course and semester.
              </p>
              <form
                onSubmit={handleUpdateSemester}
                className="flex flex-col gap-3"
              >
                <select
                  value={courseName}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  required
                  className="px-4 py-2 border border-gray-900 rounded-md focus:outline-none text-[#bb6d1e] bg-[#FAF1EA]"
                >
                  <option value="">Select Course</option>
                  {COURSE_CATALOG.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name} ({item.duration})
                    </option>
                  ))}
                </select>
                <select
                  value={specialization}
                  onChange={(e) => {
                    setSpecialization(e.target.value);
                    setSemester("");
                  }}
                  required
                  disabled={!courseName}
                  className="px-4 py-2 border border-gray-900 rounded-md focus:outline-none text-[#bb6d1e] bg-[#FAF1EA] disabled:opacity-60"
                >
                  <option value="">Select Specialization</option>
                  {selectedCourse?.specializations.map((spec) => (
                    <option key={spec.value} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                    disabled={!specialization}
                    className="px-4 py-2 border border-gray-900 rounded-md focus:outline-none text-[#bb6d1e] bg-[#FAF1EA] disabled:opacity-60"
                  >
                    <option value="">Select Semester</option>
                    {semesterOptions.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={loading || !semester || !specialization}
                    className="px-4 py-2 bg-[#156662] text-[#E8D1A8] rounded-md hover:bg-[#104D4B] hover:text-[#D4A373] disabled:opacity-60"
                  >
                    Update
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="mt-10 pt-6 border-t border-[#bb6d1e]">
            <h4 className="text-lg font-bold text-[#bb6d1e] mb-2">Face Login</h4>
            <p className="text-sm text-[#125957] mb-4">
              Optional alternate login. After you enroll, use{" "}
              <span className="font-semibold">Face Only</span> on the login page
              (email + camera). Email Login stays email and password only.
            </p>

            {faceEnabled ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-[#156662]">
                  Face login is enabled for your account.
                </p>
                <p className="text-sm text-[#125957]">
                  Log out, then choose <span className="font-semibold">Face Only</span>{" "}
                  on the login page. Or keep using{" "}
                  <span className="font-semibold">Email Login</span> without face.
                </p>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => dispatch(disableFace())}
                  className="px-4 py-2 bg-gray-700 text-[#EAC9AA] rounded-md hover:bg-gray-900 disabled:opacity-60 w-fit"
                >
                  Disable Face Login
                </button>
              </div>
            ) : showEnrollCamera ? (
              <div className="flex flex-col gap-3">
                <FaceCapture
                  onCapture={handleEnrollFace}
                  captureLabel="Enroll Face"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowEnrollCamera(false)}
                  className="px-4 py-2 bg-gray-500 text-[#EAC9AA] rounded-md hover:bg-gray-700 w-fit"
                >
                  Cancel Enrollment
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowEnrollCamera(true)}
                className="px-4 py-2 bg-[#156662] text-[#E8D1A8] rounded-md hover:bg-[#104D4B] hover:text-[#D4A373]"
              >
                Enable Face Login
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;
