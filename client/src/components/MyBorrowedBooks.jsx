import { useEffect, useState } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { getFineForUserBorrowedBook, formatPriceWithFine } from "../utils/fineCalculator.js";

const MyBorrowedBooks = ({ initialFilter = "nonReturned" }) => {

  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  const openReadPopup = async (borrowedBook) => {
    const bookId = borrowedBook.bookId;
    const catalogBook = books.find(
      (book) => String(book._id) === String(bookId)
    );

    let details = {
      title:
        catalogBook?.title ||
        borrowedBook.title ||
        borrowedBook.bookTitle ||
        "",
      author: catalogBook?.author || borrowedBook.author || "",
      description:
        catalogBook?.description || borrowedBook.description || "",
    };

    if ((!details.author || !details.description) && bookId) {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/book/details/${bookId}`,
          { withCredentials: true }
        );
        details = {
          title: data.book?.title || details.title,
          author: data.book?.author || details.author,
          description: data.book?.description || details.description,
        };
      } catch {
        // Keep whatever title/author/description we already resolved.
      }
    }

    setReadBook(details);
    dispatch(toggleReadBookPopup());
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
    const result = `${formattedDate} ${formattedTime}`;
    return result;

  };

  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const returnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === true;
  });

  const nonReturnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === false;
  })

  const booksToDisplay =

    filter === "returned" ? returnedBooks : nonReturnedBooks;

  const getBookPrice = (book) => book.price ?? books?.find((item) => item._id === book.bookId)?.price ?? 0;


  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold text-[#125957]">

            Borrowed Books

          </h2>

        </header>

        <header className="flex flex-col gap-3 sm:flex-row md:items-center sm:justify-end">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center 
              border-2 font-semibold py-2 w-full sm:w-72 ${filter === "returned"
                ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
                : "bg-gray-500 text-[#EAC9AA] border-[#DDB287] hover:text-[#D4A373] hover:bg-gray-700"

              }`}

            onClick={() => setFilter("returned")}
          >
            Returned Books

          </button>

          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center 
              border-2 font-semibold py-2 w-full sm:w-72 ${filter === "nonReturned"
                ? "bg-[#156662] text-[#EAC9AA] border-[#DDB287]"
                : "bg-gray-500 text-[#EAC9AA] border-[#DDB287] hover:text-[#D4A373] hover:bg-gray-700"

              }`}

            onClick={() => setFilter("nonReturned")}
          >
            Non-Returned Books

          </button>

        </header>

        {
          booksToDisplay && booksToDisplay.length > 0 ? (
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
                    <th className="px-4 py-2 text-left text-[#F5E6C8]">View</th>
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
                        <td className="px-4 py-2 text-center">{book.returned ? "Yes" : "No"}</td>
                        <td className="px-7 py-5 text-center">
                          <BookA
                            className="cursor-pointer"
                            onClick={() => openReadPopup(book)}
                          />
                        </td>
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
             No non-returned books  found!
            </h3>
          )}

      </main>
      {
        readBookPopup && <ReadBookPopup book={readBook} />
      }
    </>
  );
};

export default MyBorrowedBooks;
