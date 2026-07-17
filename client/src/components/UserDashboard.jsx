import { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import returnIcon from "../assets/redo_F5E6C8.png";
import browseIcon from "../assets/pointing_F5E6C8.png";
import bookIcon from "../assets/book-square-F5E6C8.png";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux"
import Header from "../layout/Header"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from "chart.js";
import logo from "../assets/black-logo2.png";
import { getFineForUserBorrowedBook } from "../utils/fineCalculator.js";

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

const UserDashboard = ({ navigateTo }) => {

  const { settingPopup } = useSelector((state) => state.popup)
  const { userBorrowedBooks } = useSelector((state) => state.borrow)

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0)
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0)
  const [totalOutstandingFines, setTotalOutstandingFines] = useState(0)

  useEffect(() => {
    let numberOfTotalBorrowedBooks = userBorrowedBooks.filter(
      (book) => book.returned === false
    );
    let numberOfTotalReturnedBooks = userBorrowedBooks.filter(
      (book) => book.returned === true
    );
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);

    const outstandingFines = userBorrowedBooks
      .filter((book) => book.returned === false)
      .reduce((sum, book) => sum + getFineForUserBorrowedBook(book), 0);
    setTotalOutstandingFines(outstandingFines);
  }, [userBorrowedBooks]);

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
          {/* LEFT SIDE*/}
          <div className="flex flex-[4] flex-col gap-7 lg:gap-7  lg:py-5 justify-between xl:min-h-[85.5vh]">
            <div className="flex flex-col gap-7 flex-[4]">
              <div className="flex flex-col lg:flex-raw gap-7 overflow-y-hidden">
                <button
                  type="button"
                  className="flex items-center gap-3 bg-[#125957] p-5 min-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 hover:cursor-pointer text-left w-full"
                  onClick={() => navigateTo("My Borrowed Books", "nonReturned")}
                >
                  <span className="bg-gray-900 h-20 lg:h-full  min-w-20 flex justify-center items-center rounded-lg"><img src={bookIcon} alt="book-icon"
                    className="w-8 h-8" /></span>
                  <span className="w-[2px] bg-[#bb6d1e] h-20 lg:h-full">
                  </span>
                  <p className="text-lg xl:text-x1 font-semibold text-[#DDB287]">Your Borrowed Book List</p>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-3 bg-[#125957] p-5 min-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 hover:cursor-pointer text-left w-full"
                  onClick={() => navigateTo("My Borrowed Books", "returned")}
                >
                  <span className="bg-gray-900 h-20 lg:h-full  min-w-20 flex justify-center items-center rounded-lg">
                    <img src={returnIcon} alt="return-icon"
                      className="w-8 h-8" /></span>
                  <span className="w-[2px] bg-[#bb6d1e] h-20 lg:h-full">
                  </span>
                  <p className="text-lg xl:text-x1 font-semibold text-[#DDB287]">
                    Your Returned Book List
                  </p>
                </button>
              </div>
              <div className="flex flex-col lg:flex-row gap-7  overflow-hidden">
                <button
                  type="button"
                  className="flex items-center gap-3 bg-[#125957] p-5 min-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 hover:cursor-pointer text-left w-full"
                  onClick={() => navigateTo("Books")}
                >
                  <span className="bg-gray-900 h-20 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                    <img src={browseIcon} alt="browse-icon" className="w-8 h-8" />
                  </span>

                  <span className="w-[2px] bg-[#bb6d1e] h-20 lg:h-full"></span>

                  <p className="text-lg xl:text-xl font-semibold text-[#DDB287]">
                    Let's Browse Books Inventory
                  </p>
                </button>
              </div>
            </div>

            <div className="bg-[#F5E6C8] p-7 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-48 font-semibold relative flex-[3] flex justify-center items-center rounded-2xl">
              <h4 className="overFlow-y-hidden text-[#125957]">❝Welcome to BookFlow Library, where every book opens a new world of knowledge, imagination, and endless possibilities.❞</h4>
              <p className="text-[#bb6d1e] text-sm sm:text-lg absolute gap-3 mb-2 right-[35px] sm:right-[78px] bottom-[16px]">
                ~ BookFlow Team
              </p>
            </div>
          </div>
          {/* Right SIDE*/}
          <div className="flex-[2] flex-col gap-7 lg:flex-row flex lg:items-center xl:flex-col justify-between xl:gap-20 py-5">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-3xl font-bold text-[#125957] text-center mb-6">
                Books Overview
              </h2>

              <div className="w-[300px] h-[300px] mx-auto">
                <Pie
                  data={data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center p-8 w-full sm:w-[400px] xl:w-fit mr-5 ml-8 xl:p-3 2xl:p-8 gap-3 h-fit xl:min-h-[150px] bg-[#125957] xl:flex-2 rounded-lg mb-24">
              <img src={logo} alt="logo" className="w-auto h-12 2xl:h-20" />
              <span className="w-[2px] bg-[#bb6d1e] h-full"></span>
              <div className="flex flex-col gap-5">
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#DDB287]"></span>
                  <span className="text-[#DDB287]">Total Borrowed Books: {totalBorrowedBooks}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#10aaaf]"></span>
                  <span className="text-[#DDB287]">Total Returned Books: {totalReturnedBooks}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#bb6d1e]"></span>
                  <span className="text-[#DDB287]">Outstanding Fines: ₹{totalOutstandingFines.toFixed(1)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;
