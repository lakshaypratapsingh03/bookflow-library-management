import express from "express";
import { borrowedBooks, getBorrowedBooksForAdmin, recordBorrowedBook, returnBorrowBook } from "../controllers/borrowController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/record-borrow-book/:id", isAuthenticated, isAuthorized("Admin", "Librarian"), recordBorrowedBook);

router.get("/borrowed-books-by-users", isAuthenticated, isAuthorized("Admin", "Librarian"), getBorrowedBooksForAdmin);

router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);

router.put("/return-borrowed-book/:bookId", isAuthenticated, isAuthorized("Admin", "Librarian"), returnBorrowBook);

export default router;