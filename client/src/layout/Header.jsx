import { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { isUser } from "../utils/roles.js";
import { formatSemester } from "../utils/semesters.js";
import { formatCourse } from "../utils/courses.js";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes}:${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-us", options));
    };

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <header className="absolute top-0 bg-[#F5E6C8] w-full py-4 px-6 left-0 shadow-md flex justify-between item-center">
        <div className="flex items-center gap-2 mb-3">
          <img src={userIcon} alt="userIcon" className="w-8 h-8" />
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold text-[#bb6d1e]">
              {user && user.name}
            </span>
            {isUser(user?.role) && (
              <span className="text-sm font-medium sm:text-lg sm:font-semibold text-[#156662]">
                · {formatCourse(user?.course)} · {formatSemester(user?.semester)}
              </span>
            )}
            <span className="text-sm font-medium sm:text-lg text-[#0F4A6A] font-semibold">
              ({user && user.role})
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[#bb6d1e]">
          <div className="flex flex-col text-sm lg:text-base items-end font-semibold text-[#bb6d1e]">
            <span>{currentTime}</span>
            <span>{currentDate}</span>
          </div>
          <span className="h-14 w-[2px] bg-[#bb6d1e]" />
          <img
            src={settingIcon}
            alt="settingIcon"
            className="w-8 h-8"
            onClick={() => dispatch(toggleSettingPopup())}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
