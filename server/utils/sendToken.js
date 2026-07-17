export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken();
    const userObj = user.toObject ? user.toObject() : { ...user };

    delete userObj.password;
    delete userObj.faceDescriptor;
    delete userObj.verificationCode;
    delete userObj.verificationCodeExpire;
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordExpire;

    res
        .status(statusCode)
        .cookie("token", token, {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        })
        .json({
            success: true,
            user: userObj,
            message,
            token,
        });
};
