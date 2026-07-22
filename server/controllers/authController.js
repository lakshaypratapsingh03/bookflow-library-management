import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { isFaceMatch, isValidDescriptor } from "../utils/faceMatcher.js";
import { isValidCourse, isValidCourseSemester } from "../utils/courses.js";

export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password, semester, course } = req.body;
        if (
            !name ||
            !email ||
            !password ||
            !course ||
            semester === undefined ||
            semester === null ||
            semester === ""
        ) {
            return next(new ErrorHandler("Please enter all fields.", 400));
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
        const semesterNumber = Number(semester);
        const isRegistered = await User.findOne({ email, accountVerified: true });
        if (isRegistered) {
            return next(new ErrorHandler("User already exists.", 400));
        }
        const registrationAttemptsByUser = await User.find({
            email,
            accountVerified: false,
        });
        if (registrationAttemptsByUser.length >= 5) {
            return next(new ErrorHandler(
                "Too many registration attempts. Please contact support.", 400
            )
            );
        }
        if (password.length < 8 || password.length > 16) {
            return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            course,
            semester: semesterNumber,
            role: "User",
        });
        const verificationCode = await user.generateVerificationCode();
        await user.save();
        sendVerificationCode(verificationCode, email, res);

    } catch (error) {
        next(error);
    }

});



export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return next(new ErrorHandler("Email or otp is required.", 400));
    }
    try {
        const userAllEntries = await User.find({
            email,
            accountVerified: false,
        }).sort({ createdAt: -1 });

        if (userAllEntries.length === 0) {
            return next(new ErrorHandler("User not found.", 404));
        }

        let user;

        if (userAllEntries.length > 1) {
            user = userAllEntries[0];
            await User.deleteMany({
                _id: { $ne: user._id },
                email,
                accountVerified: false,
            });
        } else {
            user = userAllEntries[0];
        }

        if (user.verificationCode !== Number(otp)) {
            return next(new ErrorHandler("Invalid OTP.", 400));
        }
        const currentTime = Date.now();
        const verificationCodeExpire = new Date(
            user.verificationCodeExpire
        ).getTime();

        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("OTP has expired.", 400));
        }
        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;
        await user.save({ validateModifiedOnly: true });

        sendToken(user, 200, "Account verified", res);

    } catch (error) {
        return next(new ErrorHandler("Internal server error.", 500));
    }
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler("Please enter all fields.", 400));
    }
    const user = await User.findOne({ email, accountVerified: true }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password.", 400));
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password.", 400));
    }
    const validRoles = ["User", "Librarian", "Admin"];
    if (!validRoles.includes(role)) {
        return next(new ErrorHandler("Invalid Role.", 400));
    }
    if (user.role !== role) {
        return next(new ErrorHandler(`User does not have the role: ${role}.`, 403));
    }
    

    sendToken(user, 200, "Login successful", res);
});

export const enrollFace = catchAsyncErrors(async (req, res, next) => {
    const { descriptor } = req.body || {};
    if (!isValidDescriptor(descriptor)) {
        return next(
            new ErrorHandler(
                "A valid 128-dimension face descriptor is required.",
                400
            )
        );
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                faceDescriptor: descriptor,
                faceEnabled: true,
            },
        },
        { new: true }
    );
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    res.status(200).json({
        success: true,
        message: "Face login enrolled successfully. Use Face Only on the login page.",
        faceEnabled: true,
    });
});

export const disableFace = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    await User.updateOne(
        { _id: user._id },
        { $set: { faceEnabled: false }, $unset: { faceDescriptor: 1 } }
    );

    res.status(200).json({
        success: true,
        message: "Face login disabled successfully.",
        faceEnabled: false,
    });
});

export const faceLogin = catchAsyncErrors(async (req, res, next) => {
    const { email, descriptor } = req.body || {};

    if (!email) {
        return next(new ErrorHandler("Email is required for face login.", 400));
    }
    if (!isValidDescriptor(descriptor)) {
        return next(
            new ErrorHandler(
                "A valid 128-dimension face descriptor is required.",
                400
            )
        );
    }

    const user = await User.findOne({
        email,
        accountVerified: true,
        faceEnabled: true,
    }).select("+faceDescriptor");

    // Same generic error whether the account is missing or face is not enrolled.
    if (!user || !user.faceDescriptor?.length) {
        return next(
            new ErrorHandler(
                "Face login failed. Check your email or enroll face login in Settings.",
                401
            )
        );
    }

    if (!isFaceMatch(user.faceDescriptor, descriptor)) {
        return next(new ErrorHandler("Face verification failed. Please try again.", 401));
    }

    sendToken(user, 200, "Login successful", res);
});


export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logout successfully."
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {

    if (!req.body || !req.body.email) {
        return next(new ErrorHandler("Email is required.", 400));
    }

    const user = await User.findOne({
        email: req.body.email,
        accountVerified: true,
    });

    if (!user) {
        return next(new ErrorHandler("Invalid email.", 400));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl =
        `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message =
        generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try {

        await sendEmail({
            email: user.email,
            subject: "Library Management System Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
        });

    } catch (error) {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(
            new ErrorHandler("Failed to send email.", 500)
        );
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.params;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Reset password token is invalid or has been expired.",
                400
            )
        );
    }

    if (!req.body || !req.body.password || !req.body.confirmPassword) {
        return next(
            new ErrorHandler(
                "Please provide password and confirm password.",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(
            new ErrorHandler(
                "Password & confirm password does not match.",
                400
            )
        );
    }

    if (
        req.body.password.length < 8 ||
        req.body.password.length > 16 ||
        req.body.confirmPassword.length < 8 ||
        req.body.confirmPassword.length > 16
    ) {
        return next(
            new ErrorHandler(
                "Password must be between 8 and 16 characters.",
                400
            )
        );
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, "Password reset successfully.", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user._id).select("+password");
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("please enter all fields.", 400));
    }
    const isPasswordMatched = await bcrypt.compare(
        currentPassword,
        user.password
    );
    if (!isPasswordMatched) {
        return next(new ErrorHandler("current password is incorrect.", 400));
    }
    if (
        newPassword.length < 8 ||
        newPassword.length > 16 ||
        confirmNewPassword.length < 8 ||
        confirmNewPassword.length > 16
    ) {
        return next(
            new ErrorHandler("Password must be between 8 and 16 characters.",
                400)
        );
    }
    if (currentPassword === newPassword) {
        return next(
            new ErrorHandler(
                "Current password and new password cannot be the same.",
                400
            )
        );
    }

    if (newPassword !== confirmNewPassword) {
        return next(
            new ErrorHandler("New password and confirm password do not match.",
                400)
        );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password updated successfully.",
    });
});
export const updateSemester = catchAsyncErrors(async (req, res, next) => {
    const { semester, course } = req.body || {};
    const semesterNumber = Number(semester);

    if (!isValidCourse(course)) {
        return next(new ErrorHandler("Please select a valid course.", 400));
    }

    if (!isValidCourseSemester(course, semesterNumber)) {
        return next(
            new ErrorHandler(
                "Selected semester is not valid for this course.",
                400
            )
        );
    }

    if (req.user.role !== "User") {
        return next(new ErrorHandler("Only students have a course semester.", 400));
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { course, semester: semesterNumber } },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: `Updated to ${course}, Semester ${semesterNumber}.`,
        user,
    });
});
