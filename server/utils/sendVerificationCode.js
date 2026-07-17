import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
    try{
        const message = generateVerificationOtpEmailTemplate(verificationCode);
        sendEmail({
            email,
            subject: "verification code {BookFlow Library Management System}",
            message,
        });
        res.status(200).json({
            success: true,
            message: "Verification code sent to email.",
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to send verification code.",
         });
    }
}