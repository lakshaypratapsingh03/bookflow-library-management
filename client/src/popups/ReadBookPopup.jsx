import { useDispatch } from 'react-redux';
import { toggleReadBookPopup } from '../store/slices/popUpSlice';

const ReadBookPopup = ({ book }) => {

  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-gray-100 rounded-lg shadow-lg sm:w-1/2 lg:w-1/3 ">
        <div className="flex justify-between items-center bg-[#156662] text-[#DDB287] px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-bold">View Book Info</h2>
          <button className="text-[#DDB287] text-lg font-bold w-8 h-8 border border-[#DDB287] flex items-center justify-center rounded-lg"
            onClick={() => dispatch(toggleReadBookPopup())}
          >
            &times;
          </button>
        </div>

        <div className="p-6">

          <div className="mb-4">
            <label className="block text-[#156662] font-semibold">
              Book Title
            </label>
            <p className="border border-[#DDB287] text-[#bb6d1e] font-semibold rounded-lg px-4 py-2 bg-gray-100 min-h-[2.5rem] whitespace-pre-wrap">
              {book?.title || "—"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-[#156662] font-semibold">
              Author
            </label>
            <p className="border border-[#DDB287] text-[#bb6d1e] font-semibold rounded-lg px-4 py-2 bg-gray-100 min-h-[2.5rem] whitespace-pre-wrap">
              {book?.author || "—"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-[#156662] font-semibold">
              Description
            </label>
            <p className="border border-[#DDB287] text-[#bb6d1e] font-semibold rounded-lg px-4 py-2 bg-gray-100 min-h-[2.5rem] whitespace-pre-wrap">
              {book?.description || "—"}
            </p>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 bg-gray-100 rounded-b-lg">
          <button
            className="px-4 py-2 bg-gray-500 text-[#EAC9AA]  rounded-md 
                       hover:bg-gray-700 hover:text-[#D4A373]"
            type="button"
            onClick={() => dispatch(toggleReadBookPopup())}
          >
            close
          </button>
        </div>

      </div>
    </div>
  )
}

export default ReadBookPopup;
