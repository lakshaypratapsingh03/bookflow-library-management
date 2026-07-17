import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar.jsx";
import AdminDashboard from "../components/AdminDashboard.jsx";
import UserDashboard from "../components/UserDashboard.jsx";
import BookManagement from "../components/BookManagement.jsx";
import Catalog from "../components/Catalog.jsx";
import Users from "../components/Users.jsx";
import Admins from "../components/Admins.jsx";
import Librarians from "../components/Librarians.jsx";
import MyBorrowedBooks from "../components/MyBorrowedBooks.jsx";
import { isAdmin, isStaff, isUser } from "../utils/roles.js";




const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("");
  const [borrowedBooksFilter, setBorrowedBooksFilter] = useState("nonReturned");

  const { user, isAuthenticated } = useSelector(state => state.auth);

  const navigateTo = (component, filter) => {
    if (filter) {
      setBorrowedBooksFilter(filter);
    }
    setSelectedComponent(component);
    setIsSideBarOpen(false);
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-gray-300">
        <div
          className={`md:hidden z-10 absolute right-6 top-4 sm:top-6 justify-center items-center 
           bg-[#156662] rounded-md h-9 w-9 text-[#F5E6C8]
           ${isSideBarOpen ? "hidden" : "flex"}`}
        >
          <GiHamburgerMenu
            className="text-2xl"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        </div>
        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
          navigateTo={navigateTo}
        />


        {(() => {
          switch (selectedComponent) {
            case "Dashboard":
              return isUser(user?.role) ? (
                <UserDashboard navigateTo={navigateTo} />
              ) : (
                <AdminDashboard navigateTo={navigateTo} />
              );
              break;
            case "Books":
              return <BookManagement />;
              break;
            case "Catalog":
              if (isStaff(user?.role)) {
                return <Catalog />;
              }
              break;
            case "Users":
              if (isStaff(user?.role)) {
                return <Users />;
              }
              break;
            case "Admins":
              if (isAdmin(user?.role)) {
                return <Admins />;
              }
              break;
            case "Librarians":
              if (isAdmin(user?.role)) {
                return <Librarians />;
              }
              break;
            case "My Borrowed Books":
              return <MyBorrowedBooks initialFilter={borrowedBooksFilter} />;
              break;
            default:
              return isUser(user?.role) ? (
                <UserDashboard navigateTo={navigateTo} />
              ) : (
                <AdminDashboard navigateTo={navigateTo} />
              );
              break;
          }
        })()}
      </div>
    </>
  );
};

export default Home;
