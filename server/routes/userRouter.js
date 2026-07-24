import express from "express";
import { getAllUsers, registerNewLibrarian } from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin", "Librarian"), getAllUsers);
router.post("/add/new-librarian", isAuthenticated, isAuthorized("Admin"), registerNewLibrarian);

export default router;
