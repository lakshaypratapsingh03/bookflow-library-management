import { useSelector } from "react-redux";
import Header from "../layout/Header.jsx";

const Users = () => {

  const { users } = useSelector((state) => state.user)

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


  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold text-[#125957]">
            Registered Users
          </h2>
        </header>


        {/* Table */}
        {
          users && users.filter(u => u.role === "User").length > 0 ? (
            <div className="mt-3 overflow-auto bg-[#bb6d1e] rounded-md shadow-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#156662]" >
                    <th className="px-4 py-2 text-left text-[#F5E6C8]">ID</th>
                    <th className="px-4 py-2 text-left text-[#F5E6C8]">Name</th>
                    <th className="px-4 py-2 text-left text-[#F5E6C8]">Email</th>
                    <th className="px-4 py-2 text-left text-[#F5E6C8]">Role

                    </th>
                    <th className="px-4 py-2 text-center text-[#F5E6C8]">No. of Books Borrowed

                    </th>
                    <th className="px-4 py-2 text-center text-[#F5E6C8]">Registered On

                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u => u.role === "User")
                    .map((user, index) => (
                      <tr
                        key={user._id}
                        className={(index + 1) % 2 === 0 ?
                          "bg-gray-100 text-[#bb6d1e] font-semibold" : "bg-[#F1F1F1] text-[#bb6d1e] font-semibold"}
                      >

                        <td className="px-4 py-2">{index + 1}.
                        </td>
                        <td className="px-4 py-2">{user.name}
                        </td>
                        <td className="px-4 py-2">{user.email}
                        </td>
                        <td className="px-4 py-2">{user.role}
                        </td>
                        <td className="px-4 py-2 text-center">{user?.borrowedBooks.length}
                        </td>
                        <td className="px-4 py-2 text-center">{formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table >

            </div >
          ) : (
            <h3 className="text-3xl mt-5 font-medium text-[#DDB287]">No registered </h3>
          )}

      </main >
    </>
  );
};

export default Users;
