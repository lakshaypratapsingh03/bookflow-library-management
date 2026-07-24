import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Borrow } from "../models/borrowModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import { User } from '../models/userModel.js';
import { calculateFine } from "../utils/fineCalculator.js";

const PAYMENT_STATUSES = ["Unpaid", "Paid"];

const formatReceiptDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
};

const generateReceiptNumber = async (returnDate) => {
    const dayStart = new Date(returnDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(returnDate);
    dayEnd.setHours(23, 59, 59, 999);

    const returnedToday = await Borrow.countDocuments({
        returnDate: { $gte: dayStart, $lte: dayEnd },
        receiptNumber: { $ne: null },
    });

    const sequence = String(returnedToday + 1).padStart(4, "0");
    return `BF-${formatReceiptDate(returnDate)}-${sequence}`;
};

const matchBorrowRecord = (borrowRecords, book, usedRecordIds) => {
    const bookId = book.bookId.toString();
    const candidates = borrowRecords.filter((item) => {
        if (usedRecordIds.has(item._id.toString())) return false;
        if (item.book.toString() !== bookId) return false;
        const isReturnedRecord = item.returnDate != null;
        return book.returned ? isReturnedRecord : !isReturnedRecord;
    });

    if (candidates.length === 0) return null;

    let record = candidates[0];
    if (candidates.length > 1 && book.borrowedDate) {
        const target = new Date(book.borrowedDate).getTime();
        record = candidates.reduce((best, item) => {
            const d = Math.abs(new Date(item.borrowedDate).getTime() - target);
            const bestD = Math.abs(new Date(best.borrowedDate).getTime() - target);
            return d < bestD ? item : best;
        });
    }
    return record;
};

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { email } = req.body || {};

    const book = await Book.findById(id);
    if (!book) {
        return next(new ErrorHandler("Book not found", 404));
    }
    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    if (book.quantity === 0) {
        return next(new ErrorHandler("Book is currently unavailable.", 400));
    }
    const isAlreadyBorrowed = user.borrowedBooks.find(
        (b) => b.bookId.toString() === id && b.returned === false
    );
    if (isAlreadyBorrowed) {
        return next(new ErrorHandler("Book already borrowed. ", 400));
    }
    book.quantity -= 1;
    book.availability = book.quantity > 0;
    await book.save();

    user.borrowedBooks.push({
        bookId: book._id,
        bookTitle: book.title,
        author: book.author,
        description: book.description,
        borrowedDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();
    await Borrow.create({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        book: book._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        price: book.price,
    });
    res.status(200).json({
        success: true,
        message: "Borrowed book recorded successfully.",
    });
});


export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const { email, paymentStatus: rawPaymentStatus } = req.body || {};
    const paymentStatus = PAYMENT_STATUSES.includes(rawPaymentStatus)
        ? rawPaymentStatus
        : "Unpaid";

    const book = await Book.findById(bookId);
    if (!book) {
        return next(new ErrorHandler("Book not found", 404));
    }
    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    const borrowedBook = user.borrowedBooks.find(
        (b) => b.bookId.toString() === bookId && b.returned === false
    );
    if (!borrowedBook) {
        return next(new ErrorHandler("You have not borrowed this book.", 400));
    }
    borrowedBook.returned = true;
    await user.save();

    book.quantity += 1;
    book.availability = book.quantity > 0;
    await book.save();

    const borrow = await Borrow.findOne({
        book: bookId,
        "user.email": email,
        returnDate: null,
    });

    if (!borrow) {
        return next(new ErrorHandler("You have not borrowed this book.", 400));
    }

    const returnDate = new Date();
    borrow.returnDate = returnDate;
    const fine = calculateFine(borrow.dueDate);
    borrow.fine = fine;
    borrow.paymentStatus = paymentStatus;
    borrow.paidAt = paymentStatus === "Paid" ? returnDate : null;
    borrow.receiptNumber = await generateReceiptNumber(returnDate);
    await borrow.save();

    await borrow.populate("book", "title author");

    res.status(200).json({
        success: true,
        message: fine !== 0
            ? `The book has been returned successfully. The total charges, including a fine, are ₹${fine + book.price}`
            : `The book has been returned successfully. The total charges are ₹${book.price}`,
        borrow,
    });
});


export const updatePaymentStatus = catchAsyncErrors(async (req, res, next) => {
    const { borrowId } = req.params;
    const { paymentStatus } = req.body || {};

    if (!PAYMENT_STATUSES.includes(paymentStatus)) {
        return next(new ErrorHandler("Payment status must be Unpaid or Paid.", 400));
    }

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
        return next(new ErrorHandler("Borrow record not found.", 404));
    }
    if (!borrow.returnDate) {
        return next(new ErrorHandler("Payment status can only be set for returned books.", 400));
    }

    borrow.paymentStatus = paymentStatus;
    borrow.paidAt = paymentStatus === "Paid" ? new Date() : null;
    await borrow.save();
    await borrow.populate("book", "title author");

    res.status(200).json({
        success: true,
        message: `Payment status updated to ${paymentStatus}.`,
        borrow,
    });
});


export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("User is not authenticated.", 401));
    }
    const borrowedBooks = req.user.borrowedBooks || [];
    const borrowRecords = await Borrow.find({ "user.id": req.user._id });

    const bookIds = borrowedBooks.map((book) => book.bookId);
    const bookDocs = await Book.find({ _id: { $in: bookIds } }).select(
        "title author description price"
    );
    const bookById = new Map(
        bookDocs.map((book) => [book._id.toString(), book])
    );

    const usedRecordIds = new Set();
    const enrichedBorrowedBooks = borrowedBooks.map((book) => {
        const bookId = book.bookId.toString();
        const record = matchBorrowRecord(borrowRecords, book, usedRecordIds);
        if (record) {
            usedRecordIds.add(record._id.toString());
        }
        const bookDoc = bookById.get(bookId);

        const fine = book.returned
            ? (record?.fine ?? 0)
            : calculateFine(book.dueDate);

        return {
            ...book.toObject(),
            title: bookDoc?.title || book.bookTitle || "",
            author: bookDoc?.author || book.author || "",
            description: bookDoc?.description || book.description || "",
            price: record?.price ?? bookDoc?.price ?? 0,
            fine,
            borrowId: record?._id ?? null,
            receiptNumber: record?.receiptNumber ?? null,
            paymentStatus: record?.paymentStatus ?? "Unpaid",
            returnDate: record?.returnDate ?? null,
            paidAt: record?.paidAt ?? null,
            studentName: req.user?.name || record?.user?.name || "",
            studentEmail: req.user?.email || record?.user?.email || "",
            course: req.user?.course || "",
            semester: req.user?.semester || null,
        };
    });

    res.status(200).json({
        success: true,
        borrowedBooks: enrichedBorrowedBooks,
    });
});



export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
    const borrowedBooks = await Borrow.find().populate("book", "title author");
    res.status(200).json({
        success: true,
        borrowedBooks,
    });
});
