import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';
import { addBook, deleteBook, getAllBooks, getBookDetails } from '../controllers/bookController.js';
import express from 'express';


const router = express.Router();


router.post("/admin/add", isAuthenticated, isAuthorized("Admin", "Librarian"), addBook);
router.get("/all", isAuthenticated, getAllBooks);
router.get("/details/:id", isAuthenticated, getBookDetails);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin", "Librarian"), deleteBook);


export default router;