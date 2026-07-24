import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ accountVerified: true });
    res.status(200).json({
        success: true,
        users,
    });
});

export const registerNewLibrarian = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
        return next(new ErrorHandler("User already registered.", 400));
    }
    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 to 16 characters long.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const librarian = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Librarian",
        accountVerified: true,
    });
    res.status(201).json({
        success: true,
        message: "Librarian registered successfully.",
        librarian,
    });
});
