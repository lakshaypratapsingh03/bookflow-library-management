import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { returnBook } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";

const ReturnBookPopup = ({bookId, email}) => {
    
  const dispatch = useDispatch()
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");

  const handleReturnBook = (e)=>{
    e.preventDefault();
    dispatch(returnBook(email, bookId, paymentStatus));
    dispatch(toggleReturnBookPopup());
  };
  
  
  return (
   <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-[#156662] text-[#DDB287] rounded-lg shadow-lg md:w-1/3 ">
        <div className="p-6">
        <h3 className="text-xl font-bold mb-4"
        >
          Return Book
          </h3>
          <form onSubmit={handleReturnBook}>
            
            <div className="mb-4">
             
              <label className="block text-[#F5E6C8] font-medium mb-2"
              >
                User Email
                </label>
                <input 
                type="email" 
                defaultValue={email}
                 placeholder="Borrower's Email"
                 className="w-full px-4 py-2 bg-[#F5E6C8] border-2 border-[#DDB287] text-[#bb6d1e] font-semibold outline-none rounded-md"
                 required
                 disabled
                 />
            </div>

            <div className="mb-4">
              <label className="block text-[#F5E6C8] font-medium mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-4 py-2 bg-[#F5E6C8] border-2 border-[#DDB287] text-[#bb6d1e] font-semibold outline-none rounded-md"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-4">
              
              <button  
              type="submit"
              
              className="border-2 border-[#DDB287] px-4 font-semibold bg-[#EAC9AA] text-[#104D4B] py-2 
              rounded-lg hover:bg-[#104D4B] hover:text-[#D4A373] transition"
              >
                Return
              </button>
              
              <button 
              type="button"
              onClick={() => {
                dispatch(toggleReturnBookPopup());
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
   </>
  )
}

export default ReturnBookPopup
