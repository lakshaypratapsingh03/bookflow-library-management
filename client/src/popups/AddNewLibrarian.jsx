import { useState } from "react";
import closeIcon from "../assets/close-square2.png";
import keyIcon from "../assets/key1.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewLibrarian } from "../store/slices/userSlice";
import { toggleAddNewLibrarianPopup } from "../store/slices/popUpSlice";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

const AddNewLibrarian = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAddNewLibrarian = (e) => {
    e.preventDefault();
    dispatch(addNewLibrarian({ name, email, password }));
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-gray-100 rounded-lg shadow-lg md:w-1/3">
        <div className="p-6">
          <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-[#bb6d1e]">
            <div className="flex items-center gap-3">
              <img src={keyIcon} alt="Key-icon" className="bg-[#156662] p-2 rounded-lg h-12 w-12" />
              <h3 className="text-xl font-bold text-[#bb6d1e]">Add New Librarian</h3>
            </div>
            <img
              src={closeIcon}
              alt="close-icon"
              className="h-9 w-9"
              onClick={() => dispatch(toggleAddNewLibrarianPopup())}
            />
          </header>

          <form onSubmit={handleAddNewLibrarian}>
            <div className="mb-5">
              <label className="block text-[#125957] font-medium text-xl mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Librarian's Name"
                className="w-full px-4 py-2 border border-gray-900 rounded-md focus:outline-none text-[#bb6d1e] bg-[#FAF1EA] text-xl"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[#125957] font-medium text-xl mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Librarian's Email"
                className="w-full px-4 py-2 border border-gray-900 rounded-md focus:outline-none text-[#bb6d1e] bg-[#FAF1EA] text-xl"
              />
            </div>

            <div className="mb-5 relative">
              <label className="block text-[#125957] font-medium text-xl mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Librarian's Password"
                className="w-full px-4 py-2 border border-gray-900 rounded-md focus:outline-none text-[#bb6d1e] bg-[#FAF1EA] text-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2/3 -translate-y-1/2 text-[#125957]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#156662] text-[#E8D1A8] rounded-md hover:bg-[#104D4B] hover:text-[#D4A373]"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => dispatch(toggleAddNewLibrarianPopup())}
                className="px-4 py-2 bg-gray-500 text-[#EAC9AA] rounded-md hover:bg-gray-700 hover:text-[#D4A373]"
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

export default AddNewLibrarian;
