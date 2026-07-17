import { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup, toggleReadBookPopup, toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice, deleteBook } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice, } from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import { isStaff, isUser } from "../utils/roles.js";
import { formatSemester } from "../utils/semesters.js";
import { formatCourse } from "../utils/courses.js";
import AddBookPopup from "../popups/AddBookPopup"
import ReadBookPopup from "../popups/ReadBookPopup"
import RecordBookPopup from "../popups/RecordBookPopup"
import { FaTrash } from "react-icons/fa";



const BookManagement = () => {

  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector((state) => state.popup);
  const { loading: borrowSliceLoading, error: borrowSliceError, message: borrowSliceMessage } = useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState({});
  const openReadPopup = (book) => {
    setReadBook({
      title: book?.title || "",
      author: book?.author || "",
      description: book?.description || "",
    });
    dispatch(toggleReadBookPopup());
  };

  const [borrowBookId, setBorrowBookId] = useState("");
  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (confirmDelete) {
      dispatch(deleteBook(id));
    }
  };

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBorrowSlice());
      dispatch(resetBookSlice());
    }
    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [
    dispatch,
    message,
    error,
    loading,
    borrowSliceError,
    borrowSliceLoading,
    borrowSliceMessage
  ]);

  const [searchedKeyword, setSearchKeyword] = useState("");
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value.toLowerCase());

  }
  const searchedBooks = books.filter((book) => 
    book.title.toLowerCase().includes(searchedKeyword)
  );

  return (
    <>

      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* sub Header*/}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-xl font-medium md:text-2xl md:font-semibold text-[#125957]">
              {user && isStaff(user.role) ? "Book Management" : "Books"}
            </h2>
            {isUser(user?.role) && (
              <p className="text-sm text-[#bb6d1e] mt-1">
                Showing books for {formatCourse(user?.course)} ·{" "}
                {formatSemester(user?.semester)}
              </p>
            )}
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {
              isAuthenticated && isStaff(user?.role) && (
                <button
                  onClick={() => dispatch(toggleAddBookPopup())}
                  className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 
                bg-[#156662] text-[#EAC9AA] rounded-md border border-[#DDB287] hover:bg-[#104D4B] hover:text-[#D4A373] transition"
                >
                  <span className="bg-white flex justify-center  items-center overflow-hidden rounded-full 
                  text-black w-[25px] h-[25px] text-[27px] absolute left-5 font-semibold mb-2 mt-2">
                    +
                  </span>
                  Add Book
                </button>
              )}
            <input
              type="text"
              placeholder="search books..."
              className="w-full sm:w-52 border p-2 border-[#DDB287] hover:border-[#125957] focus:outline-none rounded-md text-[#125957]"
              value={searchedKeyword}
              onChange={handleSearch}
            />

          </div>
        </header>

        {/* Table */}
        {isUser(user?.role) && (!user?.semester || !user?.course) ? (
          <h3 className="text-xl mt-10 font-medium text-[#DDB287]">
            Set your course and semester in Settings to see books.
          </h3>
        ) : books && books.length > 0 ? (
          <div className="mt-6 bg-[#bb6d1e] overflow-auto rounded-md shadow-lg ">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#156662]">
                  <th className="px-4 py-2 text-left text-[#F5E6C8]">ID</th>
                  <th className="px-4 py-2 text-left text-[#F5E6C8]">Name of books</th>
                  <th className="px-4 py-2 text-left text-[#F5E6C8]">Name of authors</th>
                  <th className="px-4 py-2 text-center text-[#F5E6C8]">Course</th>
                  <th className="px-4 py-2 text-center text-[#F5E6C8]">Semester</th>
                  {
                    isAuthenticated && isStaff(user?.role) && (
                      <th className="px-4 py-2 text-center text-[#F5E6C8]">Quantity</th>
                    )}
                  <th className="px-4 py-2 text-left text-[#F5E6C8]">Price</th>
                  <th className="px-4 py-2 text-left text-[#F5E6C8]">Availability</th>
                  {
                    isAuthenticated && isStaff(user?.role) && (
                      <th className="px-4 py-2 text-center text-[#F5E6C8]">Record Book</th>
                    )}
                </tr>
              </thead>
              <tbody>
                {searchedBooks.map((book, index) => (
                   <tr
                        key={book._id}
                        className={`${(index + 1) % 2 === 0
                            ? "bg-gray-100 text-[#bb6d1e] font-semibold"
                            : "bg-gray-100 text-[#bb6d1e] font-semibold"
                          } ${index !== searchedBooks.length - 1
                            ? "border-b border-[#DDB287]"
                            : ""
                          }`}
                      >
                    <td className="px-4 py-2 text-left">{index + 1}.</td>
                    <td className="px-4 py-2 text-left">{book.title}</td>
                    <td className="px-4 py-2 text-left ">{book.author}</td>
                    <td className="px-4 py-2 text-center">{book.course ?? "—"}</td>
                    <td className="px-4 py-2 text-center">{book.semester ?? "—"}</td>
                    {isAuthenticated && isStaff(user?.role) && (
                        <td className="px-4 py-2 text-center text-[#bb6d1e]">{book.quantity}</td>
                      )}
                    <td className="px-4 py-2 text-[#bb6d1e]">{`₹${book.price}`}</td>
                    <td className="px-4 py-2 text-[#bb6d1e] text-left">{book.availability ? "Available" : "Unavailable"}
                    </td>
                    {
                      isAuthenticated && isStaff(user?.role) && (
                        <td className="px-4 py-2 flex space-x-2 my-3 justify-center items-center text-[#bb6d1e]">
                          <BookA
                            className="cursor-pointer"
                            onClick={() => openReadPopup(book)}
                          />
                          <NotebookPen
                            className="cursor-pointer"
                            onClick={() => openRecordBookPopup(book._id)}
                          />
                          <FaTrash
                            onClick={() => handleDelete(book._id)}
                          />
                        </td>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
        <h3 className="text-3xl mt-5 font-medium text-[#DDB287]">
          No books found in library
        </h3>
        )}
      </main>
        {addBookPopup && <AddBookPopup/>}
        {readBookPopup && <ReadBookPopup book={readBook}/>}
        {recordBookPopup && <RecordBookPopup bookId={borrowBookId}/>}
    </>
    );
};

export default BookManagement;
