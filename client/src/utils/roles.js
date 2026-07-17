export const isAdmin = (role) => role === "Admin";
export const isLibrarian = (role) => role === "Librarian";
export const isStaff = (role) => role === "Admin" || role === "Librarian";
export const isUser = (role) => role === "User";
