import express from 'express';
import {
    disableFace,
    enrollFace,
    faceLogin,
    forgotPassword,
    getUser,
    login,
    logout,
    register,
    resetPassword,
    updatePassword,
    updateSemester,
    verifyOTP,
} from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/face/login", faceLogin);
router.post("/face/enroll", isAuthenticated, enrollFace);
router.delete("/face", isAuthenticated, disableFace);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);
router.put("/semester/update", isAuthenticated, updateSemester);

export default router;
