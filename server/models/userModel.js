import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["User","Librarian", "Admin"],
        default: "User",
    },
    course: {
        type: String,
        default: null,
    },
    semester: {
        type: Number,
        min: 1,
        max: 8,
        default: null,
    },
    accountVerified: { type: Boolean, default: false },
    borrowedBooks: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
            },
            returned: {
                type: Boolean,
                default: false,
            },
            bookTitle: String,
            author: String,
            description: String,
            borrowedDate: Date,
            dueDate: Date,
        },
    ],
    avatar: {
        public_id: String,
        url: String,
    },
    faceEnabled: {
        type: Boolean,
        default: false,
    },
    faceDescriptor: {
        type: [Number],
        select: false,
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},
    {
        timestamps: true
    }
);

userSchema.methods.generateVerificationCode = function () {
    function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, 0);
        return parseInt(firstDigit + remainingDigits);
    }
    const verificationCode = generateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;
    return verificationCode;
};

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export const User = mongoose.model("User", userSchema); 