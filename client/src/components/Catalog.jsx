import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";
import { getFineForBorrowRecord, formatPriceWithFine } from "../utils/fineCalculator.js";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, allBorrowedBooks, message } = useSelector((state) => state.borrow);
  const { books } = useSelector((state) => state.book);

  const getBookId = (record) =>
    typeof record.book === "string" ? record.book : record.book?._id;

  const getBookTitle = (record) => {
    if (record.book?.title) return record.book.title;
    const bookId = getBookId(record);
    return books?.find((item) => item._id === bookId)?.title ?? "—";
  };

  const [filter, setFilter] = useState("borrowed")

  const formatDateAndTime = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedTime = `${String(hours % 12 || 12).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")} ${ampm}`;
    const result = `${formattedDate} ${formattedTime}`;
    return result;

  };
  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;;

  };

  const currentDate = new Date();

  const BorrowedBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  });

  const overdueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate;
  });

  const booksToDisplay = filter === "borrowed" ? BorrowedBooks : overdueBooks;

  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");
  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopup());


  };
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());

    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
    

  }, [dispatch, error, loading ]);

  
  
  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        {/* <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold text-[#125957]">

            Borrowed Books

          </h2>

        </header>*/}

        <header className="flex flex-col gap-3 sm:flex-row md:items-center sm:justify-end">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center 
              border-2 font-semibold py-2 w-full sm:w-72 ${filter === "borrowed"
                ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
                : "bg-gray-500 text-[#EAC9AA] border-[#DDB287] hover:text-[#D4A373] hover:bg-gray-700"

              }`}

            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books

          </button>

          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center 
              border-2 font-semibold py-2 w-full sm:w-72 ${filter === "overdue"
                ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
                : "bg-gray-500 text-[#EAC9AA] border-[#DDB287] hover:text-[#D4A373] hover:bg-gray-700"

              }`}

            onClick={() => setFilter("overdue")}
          >
            Overdue Borrowers

          </button>

        </header>

        {
          booksToDisplay && booksToDisplay.length > 0 ? (
            <div className="mt-6 overflow-auto bg-[#bb6d1e] rounded-md shadow-lg">
              <table className="min-w-full border-collapse ">
                <thead>
                  <tr className="bg-[#156662]">
                    <th className="px-4 py-2 text-left text-[#F5E6C8]">ID</th>
                    <th className="px-4 py-2 text-left text-[#F5E6C8]">Book Name</th>
                    <th className="px-4 py-2 text-left text-[#F5E6C8]">Username</th>
                    <th className="px-4 py-2 text-left text-[#F5E6C8]">Email</th>
                    <th className="px-4 py-2 text-center text-[#F5E6C8]">Charges</th>
                    <th className="px-4 py-2 text-center text-[#F5E6C8]">Due Date</th>
                    <th className="px-4 py-2 text-center text-[#F5E6C8]">Date & Time</th>
                    <th className="px-4 py-2 text-center text-[#F5E6C8]">Returned</th>
                  </tr>
                </thead>
                <tbody>

                  {
                    booksToDisplay.map((book, index) => (
                      <tr
                        key={book._id}
                        className={`${(index + 1) % 2 === 0
                          ? "bg-gray-100 text-[#bb6d1e] font-semibold"
                          : "bg-gray-100 text-[#bb6d1e] font-semibold"
                          } ${index !== booksToDisplay.length - 1
                            ? "border-b border-[#DDB287]"
                            : ""
                          }`}
                      >
                        <td className="px-4 py-2 text-left">{index + 1}.</td>
                        <td className="px-4 py-2 text-left">{getBookTitle(book)}</td>
                        <td className="px-4 py-2 text-left">{book?.user.name}</td>
                        <td className="px-4 py-2 text-left">{book?.user.email}</td>
                        <td className="px-4 py-2 text-center">
                          {formatPriceWithFine(book.price, getFineForBorrowRecord(book))}
                        </td>
                        <td className="px-4 py-2 text-center">{formatDate(book.dueDate)}</td>
                        <td className="px-4 py-2 text-center">{formatDateAndTime(book.createdAt)}
                        </td>
                        <td className="px-4 py-2 flex space-x-2 my-3 justify-center text-[#bb6d1e]">
                        {  
                          book.returnDate ? (
                            <FaSquareCheck className="w-6 h-6 "/>
                          ) :(
                            <PiKeyReturnBold 
                            onClick={() =>
                              openReturnBookPopup(getBookId(book), book?.user.email)
                             }
                             className="w-6 h-6 "
                             />
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          
          ) : (
            <h3 className="text-3xl mt-56 font-medium text-[#bb6d1e] text-center font-semibold">
             No {filter ===  "borrowed" ? "borrowed" : "overdue"} books found!!
            </h3>
          )}

      </main>
      {
        returnBookPopup && <ReturnBookPopup bookId={borrowedBookId} email={email}/>
      }
    </>
  );
};

export default Catalog;
