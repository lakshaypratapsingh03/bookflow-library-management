import { useEffect, useState } from "react";
import { ReceiptIndianRupee } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReceiptPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import ReceiptPopup from "../popups/ReceiptPopup";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { getFineForUserBorrowedBook, formatPriceWithFine } from "../utils/fineCalculator.js";

const MyBorrowedBooks = ({ initialFilter = "nonReturned" }) => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { user } = useSelector((state) => state.auth);
  const { receiptPopup } = useSelector((state) => state.popup);

  const [receiptData, setReceiptData] = useState(null);
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const openReceiptPopup = (borrowedBook) => {
    setReceiptData({
      ...borrowedBook,
      studentName: borrowedBook.studentName || user?.name || "",
      studentEmail: borrowedBook.studentEmail || user?.email || "",
      course: borrowedBook.course || user?.course || "",
      semester: borrowedBook.semester || user?.semester || null,
      bookTitle: borrowedBook.bookTitle || borrowedBook.title || "",
      author: borrowedBook.author || "",
    });
    dispatch(toggleReceiptPopup());
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedTime = `${String(hours % 12 || 12).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")} ${ampm}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const returnedBooks = userBorrowedBooks?.filter((book) => book.returned === true);
  const nonReturnedBooks = userBorrowedBooks?.filter((book) => book.returned === false);
  const booksToDisplay = filter === "returned" ? returnedBooks : nonReturnedBooks;

  const getBookPrice = (book) =>
    book.price ?? books?.find((item) => item._id === book.bookId)?.price ?? 0;

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold text-[#125957]">
            Borrowed Books
          </h2>
        </header>

        <header className="flex flex-col gap-3 sm:flex-row md:items-center sm:justify-end">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center 
              border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "returned"
                  ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
                  : "bg-gray-500 text-[#EAC9AA] border-[#DDB287] hover:text-[#D4A373] hover:bg-gray-700"
              }`}
            onClick={() => setFilter("returned")}
          >
            Returned Books
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center 
              border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "nonReturned"
                  ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
                  : "bg-gray-500 text-[#EAC9AA] border-[#DDB287] hover:text-[#D4A373] hover:bg-gray-700"
              }`}
            onClick={() => setFilter("nonReturned")}
          >
            Non-Returned Books
          </button>
        </header>

        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-[#bb6d1e] rounded-md shadow-lg">
            <table className="min-w-full border-collapse ">
              <thead>
                <tr className="bg-[#156662]">
                  <th className="px-4 py-2 text-left text-[#F5E6C8]">ID</th>
                  <th className="px-4 py-2 text-left text-[#F5E6C8]">Book Title</th>
                  <th className="px-4 py-2 text-center text-[#F5E6C8]">Date & Time</th>
                  <th className="px-4 py-2 text-center text-[#F5E6C8]">Due Date</th>
                  <th className="px-4 py-2 text-center text-[#F5E6C8]">Charges</th>
                  <th className="px-4 py-2 text-center text-[#F5E6C8]">Returned</th>
                  {filter === "returned" && (
                    <th className="px-4 py-2 text-center text-[#F5E6C8]">View Receipt</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={book._id || book.borrowId || index}
                    className={`${
                      (index + 1) % 2 === 0
                        ? "bg-gray-100 text-[#bb6d1e] font-semibold"
                        : "bg-gray-100 text-[#bb6d1e] font-semibold"
                    } ${
                      index !== booksToDisplay.length - 1
                        ? "border-b border-[#DDB287]"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-2 ">{index + 1}.</td>
                    <td className="px-4 py-2 ">{book.bookTitle}</td>
                    <td className="px-4 py-2 text-center">{formatDate(book.borrowedDate)}</td>
                    <td className="px-4 py-2 text-center">{formatDate(book.dueDate)}</td>
                    <td className="px-4 py-2 text-center">
                      {formatPriceWithFine(
                        getBookPrice(book),
                        getFineForUserBorrowedBook(book)
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {book.returned ? "Yes" : "No"}
                    </td>
                    {filter === "returned" && (
                      <td className="px-4 py-5 text-center">
                        {book.receiptNumber ? (
                          <ReceiptIndianRupee
                            className="cursor-pointer inline-block"
                            onClick={() => openReceiptPopup(book)}
                            title="View receipt"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filter === "returned" ? (
          <h3 className="text-3xl mt-56 font-medium text-[#bb6d1e] text-center semibold">
            No returned books found!
          </h3>
        ) : (
          <h3 className="text-3xl mt-56 font-medium text-[#bb6d1e] text-center font-semibold">
            No non-returned books found!
          </h3>
        )}
      </main>
      {receiptPopup && receiptData && (
        <ReceiptPopup receipt={receiptData} />
      )}
    </>
  );
};

export default MyBorrowedBooks;
