import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { Printer, ReceiptIndianRupee } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup, toggleReceiptPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
  updatePaymentStatus,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import ReceiptPopup from "../popups/ReceiptPopup";
import Header from "../layout/Header";
import { getFineForBorrowRecord, formatPriceWithFine } from "../utils/fineCalculator.js";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopup, receiptPopup } = useSelector((state) => state.popup);
  const { loading, error, allBorrowedBooks, message } = useSelector((state) => state.borrow);
  const { books } = useSelector((state) => state.book);

  const getBookId = (record) =>
    typeof record.book === "string" ? record.book : record.book?._id;

  const getBookTitle = (record) => {
    if (record.book?.title) return record.book.title;
    const bookId = getBookId(record);
    return books?.find((item) => item._id === bookId)?.title ?? "—";
  };

  const getBookAuthor = (record) => {
    if (record.book?.author) return record.book.author;
    const bookId = getBookId(record);
    return books?.find((item) => item._id === bookId)?.author ?? "";
  };

  const [filter, setFilter] = useState("borrowed");
  const [receiptData, setReceiptData] = useState(null);
  const [receiptAction, setReceiptAction] = useState(null);

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
    ).padStart(2, "0")}-${String(date.getFullYear())}`;

  };

  const currentDate = new Date();

  const activeBorrows = allBorrowedBooks?.filter((book) => !book.returnDate) || [];

  const BorrowedBooks = activeBorrows.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  });

  const overdueBooks = activeBorrows.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate;
  });

  const returnedBooks = allBorrowedBooks?.filter((book) => book.returnDate) || [];

  const booksToDisplay =
    filter === "borrowed"
      ? BorrowedBooks
      : filter === "overdue"
        ? overdueBooks
        : returnedBooks;

  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");
  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopup());
  };

  const openReceiptPopup = (record, action = null) => {
    setReceiptData({
      receiptNumber: record.receiptNumber,
      paymentStatus: record.paymentStatus || "Unpaid",
      studentName: record.user?.name || "",
      studentEmail: record.user?.email || "",
      bookTitle: getBookTitle(record),
      author: getBookAuthor(record),
      borrowedDate: record.borrowedDate,
      dueDate: record.dueDate,
      returnDate: record.returnDate,
      price: record.price,
      fine: record.fine,
      paidAt: record.paidAt,
    });
    setReceiptAction(action);
    dispatch(toggleReceiptPopup());
  };

  const handlePaymentStatusChange = (borrowId, paymentStatus) => {
    dispatch(updatePaymentStatus(borrowId, paymentStatus));
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

        <header className="flex flex-col gap-3 sm:flex-row md:items-center sm:justify-end flex-wrap">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center 
              border-2 font-semibold py-2 w-full sm:w-56 ${filter === "borrowed"
                ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
                : "bg-gray-500 text-[#EAC9AA] border-[#DDB287] hover:text-[#D4A373] hover:bg-gray-700"

              }`}

            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books

          </button>

          <button
            className={`relative rounded-none text-center 
              border-2 font-semibold py-2 w-full sm:w-56 ${filter === "overdue"
                ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
                : "bg-gray-500 text-[#EAC9AA] border-[#DDB287] hover:text-[#D4A373] hover:bg-gray-700"

              }`}

            onClick={() => setFilter("overdue")}
          >
            Overdue Borrowers

          </button>

          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center 
              border-2 font-semibold py-2 w-full sm:w-56 ${filter === "returned"
                ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
                : "bg-gray-500 text-[#EAC9AA] border-[#DDB287] hover:text-[#D4A373] hover:bg-gray-700"

              }`}

            onClick={() => setFilter("returned")}
          >
            Returned Books

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
                    <th className="px-4 py-2 text-center text-[#F5E6C8]">
                      {filter === "returned" ? "Payment" : "Returned"}
                    </th>
                    {filter === "returned" && (
                      <>
                        <th className="px-4 py-2 text-center text-[#F5E6C8]">View Receipt</th>
                        <th className="px-4 py-2 text-center text-[#F5E6C8]">Print</th>
                      </>
                    )}
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
                        <td className="px-4 py-2 text-center">
                          {filter === "returned" ? (
                            <select
                              value={book.paymentStatus || "Unpaid"}
                              onChange={(e) =>
                                handlePaymentStatusChange(book._id, e.target.value)
                              }
                              className="px-2 py-1 rounded border border-[#DDB287] bg-[#F5E6C8] text-[#bb6d1e] font-semibold text-sm outline-none"
                            >
                              <option value="Unpaid">Unpaid</option>
                              <option value="Paid">Paid</option>
                            </select>
                          ) : book.returnDate ? (
                            <FaSquareCheck className="w-6 h-6 mx-auto" />
                          ) : (
                            <PiKeyReturnBold
                              onClick={() =>
                                openReturnBookPopup(getBookId(book), book?.user.email)
                              }
                              className="w-6 h-6 mx-auto cursor-pointer"
                            />
                          )}
                        </td>
                        {filter === "returned" && (
                          <>
                            <td className="px-4 py-2 text-center">
                              {book.receiptNumber ? (
                                <ReceiptIndianRupee
                                  className="w-5 h-5 mx-auto cursor-pointer"
                                  onClick={() => openReceiptPopup(book)}
                                  title="View receipt"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {book.receiptNumber ? (
                                <Printer
                                  className="w-5 h-5 mx-auto cursor-pointer"
                                  onClick={() => openReceiptPopup(book, "print")}
                                  title="Print receipt"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          
          ) : (
            <h3 className="text-3xl mt-56 font-medium text-[#bb6d1e] text-center font-semibold">
             No {filter === "borrowed" ? "borrowed" : filter === "overdue" ? "overdue" : "returned"} books found!!
            </h3>
          )}

      </main>
      {
        returnBookPopup && <ReturnBookPopup bookId={borrowedBookId} email={email}/>
      }
      {
        receiptPopup && receiptData && (
          <ReceiptPopup receipt={receiptData} initialAction={receiptAction} />
        )
      }
    </>
  );
};

export default Catalog;
