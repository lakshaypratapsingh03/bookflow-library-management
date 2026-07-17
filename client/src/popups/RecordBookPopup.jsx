import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { recordBorrowBook } from '../store/slices/borrowSlice';
import { toggleRecordBookPopup } from '../store/slices/popUpSlice';

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const handleRecordBook = (e) => {
    
    e.preventDefault();
    
    dispatch(recordBorrowBook(email, bookId));

  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-[#156662] text-[#DDB287] rounded-lg shadow-lg md:w-1/3 ">
        <div className="p-6">
        <h3 className="text-xl font-bold mb-4"
        >
          Record Book
          </h3>
          <form onSubmit={handleRecordBook}>
            
            <div className="mb-4">
             
              <label className="block text-[#F5E6C8] font-medium mb-2"
              >
                User Email
                </label>
                <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                 placeholder="Borrower's Email"
                 className="w-full px-4 py-2 border-2 border-[#DDB287] bg-[] text-[#bb6d1e] font-semibold outline-none rounded-md"
                 required
                 />
            </div>
            
            <div className="flex justify-end space-x-4">
              
              <button  
              type="submit"
              
              className="border-2 border-[#DDB287] px-4 font-semibold bg-[#EAC9AA] text-[#104D4B] py-2 
              rounded-lg hover:bg-[#104D4B] hover:text-[#D4A373] transition"
              >
                Record
              </button>
              
              <button 
              type="button"
              onClick={() => {
                dispatch(toggleRecordBookPopup());
              }}
              className="px-4 py-2 bg-gray-500 text-[#EAC9AA]  rounded-md 
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

export default RecordBookPopup
