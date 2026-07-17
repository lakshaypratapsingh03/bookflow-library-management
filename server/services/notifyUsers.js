import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";
import { Borrow } from "../models/borrowModel.js";

export const notifyUsers = () => {
    cron.schedule("*/30 * * * * *", async () => {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers = await Borrow.find({
                dueDate: {
                    $lt: oneDayAgo,
                },
                returnDate: null,
                notified: false,

            });
            for (const element of borrowers) {

                if (element.user && element.user.email) {
                    sendEmail({
                        email: element.user.email,
                        subject: "Book Return Reminder",
                        message: `Hello Dear ${element.user.name},\n\nThis is a reminder that the book ${element.book.title} you borrowed is due for return today. Please return it as soon as possible to avoid any late fees.\n\nThank you,\nBookFlow Team.`,
                    });
                    element.notified = true;
                    await element.save();
                    console.log(`Email sent to ${element.user.email} for book ${element.book.title}`);
                }
            }
        } catch (error) {
            console.error("Some error occurred while notifying users", error);
        }

    });
}; 