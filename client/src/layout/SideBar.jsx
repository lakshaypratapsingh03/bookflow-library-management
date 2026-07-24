import { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-F5E6C8.png";
import usersIcon from "../assets/people.png";
import { FaUserTie } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { toggleAddNewLibrarianPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import { isAdmin, isStaff, isUser } from "../utils/roles.js";
import AddNewLibrarian from "../popups/AddNewLibrarian";
import SettingPopup from "../popups/SettingPopup";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, navigateTo }) => {
  const dispatch = useDispatch();
  const { addNewLibrarianPopup, settingPopup } = useSelector((state) => state.popup);
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>
      <aside
        className={`${isSideBarOpen ? "left-0" : "-left-full"}
       z-10 transition-all duration-700 md:relative 
       md:left-0 flex w-64 bg-[#156662] text-[#F5E6C8]
       flex-col h-full `}
        style={{ position: "fixed" }}
      >
        <div className="px-6 py-4 my-8 flex flex-col items-center">
          <img src={logo_with_title} alt="Logo" className="w-40" />
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex 
          items-center space-x-2 "
            onClick={() => navigateTo("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>

          <button
            className="w-full py-2 font-medium 
          bg-transparent rounded-md 
          hover:cursor-pointer flex items-center
          space-x-2 "
            onClick={() => navigateTo("Books")}
          >
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>
          {isAuthenticated && isStaff(user?.role) && (
            <>
              <button
                className="w-full py-2 font-medium 
                bg-transparent rounded-md 
                hover:cursor-pointer flex items-center 
                space-x-2 "
                onClick={() => navigateTo("Catalog")}
              >
                <img src={catalogIcon} alt="icon" />
                <span>Catalog</span>
              </button>

              <button
                className="w-full py-2 font-medium
                 bg-transparent rounded-md 
                 hover:cursor-pointer flex items-center 
                 space-x-2 "
                onClick={() => navigateTo("Users")}
              >
                <img src={usersIcon} alt="icon" />
                <span>Users</span>
              </button>
            </>
          )}

          {isAuthenticated && isAdmin(user?.role) && (
            <>
              <button
                className="w-full py-2 font-medium 
                bg-transparent rounded-md
                 hover:cursor-pointer flex items-center 
                 space-x-2 "
                onClick={() => navigateTo("Librarians")}
              >
                <FaUserTie className="w-6 h-6 text-[#F5E6C8]" /> <span>Librarians</span>
              </button>

              <button
                className="w-full py-2 font-medium 
                bg-transparent rounded-md
                 hover:cursor-pointer flex items-center 
                 space-x-2 "
                onClick={() => dispatch(toggleAddNewLibrarianPopup())}
              >
                <FaUserTie className="w-6 h-6 text-[#F5E6C8]" /> <span>Add New Librarian</span>
              </button>
            </>
          )}

          {isAuthenticated && isUser(user?.role) && (
            <>
              <button
                className="w-full py-2 font-medium
                 bg-transparent rounded-md 
                 hover:cursor-pointer flex items-center 
                 space-x-2 "
                onClick={() => navigateTo("My Borrowed Books", "nonReturned")}
              >
                <img src={catalogIcon} alt="icon" />
                <span>My Borrowed Books</span>
              </button>
            </>
          )}
          <button
            className="w-full py-2 font-medium
                 bg-transparent rounded-md 
                 hover:cursor-pointer flex items-center 
                 space-x-2 md:hidden "
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={settingIcon} alt="icon" />
            <span>Update Credentials</span>
          </button>
        </nav>
        <div className="px-6 py-4">
          <button
            className="py-2 font-medium text-center 
        bg-transparent rounded-md hover:cursor-pointer flex 
        items-center justify-center space-x-5 mx-auto 
        w-fir"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="icon" />
            <span>Log Out</span>
          </button>
        </div>
        <img
          src={closeIcon}
          alt="icon"
          onClick={() => setIsSideBarOpen(false)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden"
        />
      </aside>
      {addNewLibrarianPopup && <AddNewLibrarian />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;
