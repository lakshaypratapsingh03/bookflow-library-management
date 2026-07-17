import { useEffect, useState } from "react";
import adminIcon from "../assets/pointing_F5E6C8.png";
import usersIcon from "../assets/people-white.png";
import bookIcon from "../assets/book-square-F5E6C8.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo2.png";
import { useSelector } from "react-redux";
import Header from "../layout/Header";
import { isAdmin } from "../utils/roles.js";
import { getFineForBorrowRecord } from "../utils/fineCalculator.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = ({ navigateTo }) => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector(state => state.borrow);
  const { settingPopup } = useSelector((state) => state.popup);


  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalLibrarian, setTotalLibrarian] = useState(0);
  const [totalBooks, setTotalBooks] = useState((books && books.length) || 0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);
  const [totalOutstandingFines, setTotalOutstandingFines] = useState(0);

  useEffect(() => {
    let numberOfUsers = users.filter(user => user.role === "User");
    let numberOfAdmin = users.filter(user => user.role === "Admin");
    let numberOfLibrarian = users.filter(user => user.role === "Librarian");
    setTotalUsers(numberOfUsers.length);
    setTotalAdmin(numberOfAdmin.length);
    setTotalLibrarian(numberOfLibrarian.length);

    setTotalBooks(books?.length || 0);

    let numberOfTotalBorrowedBooks = allBorrowedBooks.filter(
      (book) => book.returnDate === null
    );
    let numberOfTotalReturnedBooks = allBorrowedBooks.filter(
      (book) => book.returnDate !== null
    );
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);

    const outstandingFines = allBorrowedBooks
      .filter((book) => book.returnDate === null)
      .reduce((sum, book) => sum + getFineForBorrowRecord(book), 0);
    setTotalOutstandingFines(outstandingFines);

  },[users, allBorrowedBooks, books]);


  const data = {
    labels: ["Total Borrowed books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#F5E6C8", "#10aaaf"],
        hoverOffset: 4,

      },
    ],
  };


  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <div className="flex flex-col-reverse xl:flex-row">
          {/* LEFT SIDE */}
          <div className="flex-[2] flex-col gap-7 lg:flex-row flex lg:items-center xl:flex-col justify-between xl:gap-20 py-5">
            <div className="xl:flex-[4] flex items-end w-full content-center">
              <Pie

                data={data}

                options={{

                  responsive: true,

                  maintainAspectRatio: false,

                }}
                className="max-auto lg:mx-0 w-full h-auto"
              />

            </div>
            <div className="flex items-center p-8 w-full sm:w-[400px] 
          xl:w-fit mr-5 xl:p-3 2xl:p-6 gap-5 
          h-fit xl:min-h-[150px] bg-[#125957]  xl:flex-1 rounded-lg mb-8">
              <img
                src={logo}
                alt="logo"
                className="w-auto xl:flex-1 rounded-lg h-20 2xl:h-20"
              />
              <span className="w-[2px] bg-[#bb6d1e] h-full"></span>
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#DDB287]"></span>
                  <span className="text-[#DDB287] font-semibold">Total Borrowed Books: {totalBorrowedBooks}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#10aaaf]"></span>
                  <span className="text-[#DDB287] font-semibold">Total Returned Books: {totalReturnedBooks}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#bb6d1e]"></span>
                  <span className="text-[#DDB287] font-semibold">Outstanding Fines: ₹{totalOutstandingFines.toFixed(1)}</span>
                </p>
              </div>
            </div>
          </div>
          {/* Right SIDE */}
          <div className="flex flex-[4] flex-col gap-7 lg:gap-16 lg:px-7 lg:py-5 justify-between xl:min-h-[85.
                5vh]">
            <div className="flex flex-col-reverse lg:flex-row gap-7 flex-[4] mt-4">
              <div className="flex flex-col gap-7 flex-1">
                <button
                  type="button"
                  className="flex items-center gap-3 bg-[#125957] p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 hover:cursor-pointer w-full lg:max-w-[360px] ml-12 text-left"
                  onClick={() => navigateTo("Users")}
                >
                  <span className="bg-gray-900 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={usersIcon} alt="users-icon" className="w-8 h-8" />
                  </span>
                  <span className="w-[2px] bg-[#bb6d1e] h-20 lg:h-full"></span>
                  <div className="flex flex-col items-center">
                    <h4 className="font-black text-[#DDB287] text-3xl">{totalUsers}</h4>
                    <p className="font-bold text-[#DDB287] text-sm">Total User Base

                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-3 bg-[#125957] p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 hover:cursor-pointer w-full lg:max-w-[360px] ml-12 text-left"
                  onClick={() => navigateTo("Books")}
                >
                  <span className="bg-gray-900 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={bookIcon} alt="book-icon" className="w-8 h-8" />
                  </span>
                  <span className="w-[2px] bg-[#bb6d1e] h-20 lg:h-full"></span>
                  <div className="flex flex-col items-center">
                    <h4 className="font-black text-[#DDB287] text-3xl">{totalBooks}</h4>
                    <p className="font-bold text-[#DDB287] text-sm">Total Book Count

                    </p>
                  </div>
                </button>

                {isAdmin(user?.role) && (
                <button
                  type="button"
                  className="flex items-center gap-3 bg-[#125957] p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 hover:cursor-pointer w-full lg:max-w-[360px] ml-12 text-left"
                  onClick={() => navigateTo("Librarians")}
                >
                  <span className="bg-gray-900 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={adminIcon} alt="librarian-icon" className="w-8 h-8" />
                  </span>
                  <span className="w-[2px] bg-[#bb6d1e] h-20 lg:h-full"></span>
                  <div className="flex flex-col items-center">
                    <h4 className="font-black text-[#DDB287] text-3xl">{totalLibrarian}</h4>
                    <p className="font-bold text-[#DDB287] text-sm">Total Librarian Count

                    </p>
                  </div>
                </button>
                )}

                {isAdmin(user?.role) && (
                <button
                  type="button"
                  className="flex items-center gap-3 bg-[#125957] p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 hover:cursor-pointer w-full lg:max-w-[360px] ml-12 text-left"
                  onClick={() => navigateTo("Admins")}
                >
                  <span className="bg-gray-900 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={adminIcon} alt="users-icon" className="w-8 h-8" />
                  </span>
                  <span className="w-[2px] bg-[#bb6d1e] h-20 lg:h-full"></span>
                  <div className="flex flex-col items-center">
                    <h4 className="font-black text-[#DDB287] text-3xl">{totalAdmin}</h4>
                    <p className="font-bold text-[#DDB287] text-sm">Total Admin Count

                    </p>
                  </div>
                </button>
                )}
              </div>
              <div className="flex flex-col lg:flex-row flex-1">
                <div className="flex flex-col lg:flex-row flex-1 items-center justify-center">
                  <div className="bg-[#043664] p-5 rounded-lg shadow-lg h-full flex flex-col justify-center items-center gap-4">
                    <img 
                    src={user && user.avatar?.url} 
                    alt="avatar" 
                    className="rounded-full w-32 h-32 object-cover"
                    />
                    <h2 className="text-xl 2xl:text-2xl font-semibold text-center">{user && user.name}</h2>
                    <p className="text-[#bb6d1e] text-sm 2xl:text-base text-center">
                     ❝Welcome to your admin dashboard. Here you can manage all the
                      settings and monitor the statistics.❞
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden xl:flex bg-[#F5E6C8] p-7 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-52
            font-semibold relative flex-[3] justify-center items-center rounded-2xl mt-20">
              <h4 className="overFlow-y-hidden text-[#125957]">
                ❝Welcome to BookFlow Library, 
                where every book opens a new world of knowledge, 
                imagination, and endless possibilities.❞
                </h4>
              <p className="text-[#bb6d1e] text-sm sm:text-lg absolute gap-3 mb-2 left-[35px] sm:right-[78px] bottom-[16px]">
                ~ BookFlow Team
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
