import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import {
  COURSE_CATALOG,
  getCourseByName,
  getSemesterOptions,
} from "../utils/courses.js";

const AddBookPopup = () => {
  const dispatch = useDispatch();
  const { message, loading } = useSelector((state) => state.book);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [courseName, setCourseName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [semester, setSemester] = useState("");

  const selectedCourse = getCourseByName(courseName);
  const semesterOptions = getSemesterOptions(courseName);

  const handleCourseChange = (nameValue) => {
    setCourseName(nameValue);
    setSemester("");
    const course = getCourseByName(nameValue);
    if (course?.specializations?.length === 1) {
      setSpecialization(course.specializations[0].value);
    } else {
      setSpecialization("");
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    dispatch(
      addBook({
        title,
        author,
        price: Number(price),
        quantity: Number(quantity),
        description,
        course: specialization,
        semester: Number(semester),
      })
    );
  };

  useEffect(() => {
    if (message) {
      dispatch(toggleAddBookPopup());
    }
  }, [dispatch, message, loading]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-[#156662] text-[#DDB287] rounded-lg shadow-lg md:w-1/3 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Record Book</h3>
          <form onSubmit={handleAddBook}>
            <div className="mb-4">
              <label className="block text-[#F5E6C8] font-medium mb-1">
                Book Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of book"
                className="w-full px-4 py-2 text-[#bb6d1e] border-2 border-[#DDB287] outline-none rounded-md font-semibold"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#F5E6C8] font-medium mb-1">
                Book Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author of book"
                className="w-full px-4 py-2 text-[#bb6d1e] border-2 border-[#DDB287] outline-none rounded-md font-semibold"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#F5E6C8] font-medium mb-1">
                Course
              </label>
              <select
                value={courseName}
                onChange={(e) => handleCourseChange(e.target.value)}
                required
                className="w-full px-4 py-2 text-[#bb6d1e] border-2 border-[#DDB287] outline-none rounded-md font-semibold bg-white"
              >
                <option value="">Select Course</option>
                {COURSE_CATALOG.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} ({item.duration})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[#F5E6C8] font-medium mb-1">
                Specialization
              </label>
              <select
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setSemester("");
                }}
                required
                disabled={!courseName}
                className="w-full px-4 py-2 text-[#bb6d1e] border-2 border-[#DDB287] outline-none rounded-md font-semibold bg-white disabled:opacity-60"
              >
                <option value="">Select Specialization</option>
                {selectedCourse?.specializations.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[#F5E6C8] font-medium mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                disabled={!specialization}
                className="w-full px-4 py-2 text-[#bb6d1e] border-2 border-[#DDB287] outline-none rounded-md font-semibold bg-white disabled:opacity-60"
              >
                <option value="">Select Semester</option>
                {semesterOptions.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[#F5E6C8] font-medium mb-1">
                Book Price (Price for borrowing)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price of book"
                className="w-full px-4 py-2 text-[#bb6d1e] border-2 border-[#DDB287] outline-none rounded-md font-semibold"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#F5E6C8] font-medium mb-1">
                Book Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity of book "
                className="w-full px-4 py-2 text-[#bb6d1e] border-2 border-[#DDB287] outline-none rounded-md font-semibold"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#F5E6C8] font-medium mb-1">
                Book Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Book's Description"
                rows={4}
                className="w-full text-[#bb6d1e] px-4 py-2 border-2 border-[#DDB287] outline-none rounded-md font-semibold"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="border-2 border-[#DDB287] px-4 font-semibold bg-[#EAC9AA] text-[#104D4B] py-2 
              rounded-lg hover:bg-[#104D4B] hover:text-[#D4A373] transition"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(toggleAddBookPopup());
                }}
                className="px-4 py-2 bg-gray-500 text-[#EAC9AA] rounded-md 
              hover:bg-gray-700 hover:text-[#D4A373]"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookPopup;
