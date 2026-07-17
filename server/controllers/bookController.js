import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { Book } from '../models/bookModel.js';
import ErrorHandler from '../middlewares/errorMiddlewares.js';
import {
    isValidCourse,
    isValidCourseSemester,
    getCourseQueryValues,
} from '../utils/courses.js';

export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity, semester, course } = req.body || {};
    if (
        !title ||
        !author ||
        !description ||
        !price ||
        !quantity ||
        !course ||
        semester === undefined ||
        semester === null ||
        semester === ""
    ) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }
    if (!isValidCourse(course)) {
        return next(new ErrorHandler("Please select a valid course.", 400));
    }
    if (!isValidCourseSemester(course, semester)) {
        return next(
            new ErrorHandler(
                "Selected semester is not valid for this course.",
                400
            )
        );
    }
    const book = await Book.create({
        title,
        author,
        description,
        price,
        quantity,
        course,
        semester: Number(semester),
        availability: Number(quantity) > 0,
    });
    res.status(201).json({
        success: true,
        message: "Book added successfully",
        book,
    });
});

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const role = req.user?.role;
    let books;

    if (role === "User") {
        if (!req.user.semester || !req.user.course) {
            books = [];
        } else {
            books = await Book.find({
                course: { $in: getCourseQueryValues(req.user.course) },
                semester: req.user.semester,
            });
        }
    } else {
        books = await Book.find();
    }

    res.status(200).json({
        success: true,
        books,
    });
});

export const getBookDetails = catchAsyncErrors(async (req, res, next) => {
    const book = await Book.findById(req.params.id).select(
        "title author description price semester course availability quantity"
    );
    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }
    res.status(200).json({
        success: true,
        book,
    });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully.",
    });
});
