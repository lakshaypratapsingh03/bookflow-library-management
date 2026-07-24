/**
 * End-to-end API test for Professional Invoice / Receipt flow.
 * Creates temporary admin, student, and book; exercises borrow → return → receipt → payment update.
 * Cleans up temp records afterward.
 */
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../config/config.env") });

const API = "http://127.0.0.1:4000/api/v1";
const stamp = Date.now();
const ADMIN_EMAIL = `e2e.admin.${stamp}@bookflow.test`;
const USER_EMAIL = `e2e.user.${stamp}@bookflow.test`;
const PASSWORD = "TestPass123!";

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  return { res, body };
}

const authCookie = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
  return `token=${token}`;
};

async function main() {
  console.log("=== BookFlow Receipt E2E ===\n");

  try {
    await fetch("http://127.0.0.1:4000/api/v1/book/all");
    console.log("1) Server reachable");
  } catch (e) {
    throw new Error(`Server not reachable on :4000 — ${e.message}`);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "MERN_STACK_LIBRARY_MANAGEMENT_SYSTEM",
  });
  console.log("2) MongoDB connected");

  const { User } = await import("../models/userModel.js");
  const { Book } = await import("../models/bookModel.js");
  const { Borrow } = await import("../models/borrowModel.js");

  const hashed = await bcrypt.hash(PASSWORD, 10);

  const admin = await User.create({
    name: "E2E Admin",
    email: ADMIN_EMAIL,
    password: hashed,
    role: "Admin",
    accountVerified: true,
    course: "BCA Full Stack",
    semester: 4,
  });

  const student = await User.create({
    name: "E2E Student",
    email: USER_EMAIL,
    password: hashed,
    role: "User",
    accountVerified: true,
    course: "BCA Full Stack",
    semester: 3,
  });

  const book = await Book.create({
    title: `E2E Receipt Book ${stamp}`,
    author: "E2E Author",
    description: "Temporary book for receipt e2e test",
    price: 50,
    quantity: 3,
    availability: true,
    semester: 3,
    course: "BCA Full Stack",
  });

  console.log("3) Seeded admin, student, book");

  // Ensure server connection can see the new users
  const adminFresh = await User.findById(admin._id);
  const studentFresh = await User.findById(student._id);
  assert(adminFresh, "Admin not found after create");
  assert(studentFresh, "Student not found after create");

  const adminCookie = authCookie(String(adminFresh._id));
  const userCookie = authCookie(String(studentFresh._id));
  let borrowId = null;
  let receiptNumber = null;

  try {
    const booksRes = await jsonFetch(`${API}/book/all`, {
      method: "GET",
      headers: { Cookie: adminCookie },
    });
    assert(booksRes.res.ok, `Auth via JWT cookie failed: ${JSON.stringify(booksRes.body)}`);
    console.log("4) Admin JWT auth OK");

    const studentBooksGate = await jsonFetch(`${API}/book/all`, {
      method: "GET",
      headers: { Cookie: userCookie },
    });
    assert(
      studentBooksGate.res.ok,
      `Student JWT auth failed on /book/all: ${JSON.stringify(studentBooksGate.body)}`
    );

    const userMe = await jsonFetch(`${API}/borrow/my-borrowed-books`, {
      method: "GET",
      headers: { Cookie: userCookie },
    });
    assert(userMe.res.ok, `Student my-borrowed-books failed: ${JSON.stringify(userMe.body)}`);
    console.log("5) Student JWT auth OK");

    const borrowRes = await jsonFetch(
      `${API}/borrow/record-borrow-book/${book._id}`,
      {
        method: "POST",
        headers: { Cookie: adminCookie },
        body: JSON.stringify({ email: USER_EMAIL }),
      }
    );
    assert(borrowRes.res.ok, `Borrow failed: ${JSON.stringify(borrowRes.body)}`);
    console.log("6) Borrow recorded OK");

    const returnRes = await jsonFetch(
      `${API}/borrow/return-borrowed-book/${book._id}`,
      {
        method: "PUT",
        headers: { Cookie: adminCookie },
        body: JSON.stringify({ email: USER_EMAIL, paymentStatus: "Paid" }),
      }
    );
    assert(returnRes.res.ok, `Return failed: ${JSON.stringify(returnRes.body)}`);
    assert(returnRes.body.borrow, "Return response missing borrow object");
    borrowId = returnRes.body.borrow._id;
    receiptNumber = returnRes.body.borrow.receiptNumber;
    assert(receiptNumber, "receiptNumber not generated");
    assert(
      /^BF-\d{8}-\d{4}$/.test(receiptNumber),
      `Bad receipt format: ${receiptNumber}`
    );
    assert(
      returnRes.body.borrow.paymentStatus === "Paid",
      `Expected Paid, got ${returnRes.body.borrow.paymentStatus}`
    );
    assert(returnRes.body.borrow.paidAt, "paidAt not set for Paid return");
    assert(returnRes.body.borrow.returnDate, "returnDate not set");
    assert(
      typeof returnRes.body.borrow.fine === "number",
      "fine missing on return"
    );
    assert(
      returnRes.body.borrow.price === 50,
      `Unexpected price ${returnRes.body.borrow.price}`
    );
    console.log(`7) Return OK — receipt ${receiptNumber}, status Paid`);

    const adminList = await jsonFetch(`${API}/borrow/borrowed-books-by-users`, {
      method: "GET",
      headers: { Cookie: adminCookie },
    });
    assert(adminList.res.ok, `Admin list failed: ${JSON.stringify(adminList.body)}`);
    const adminRecord = adminList.body.borrowedBooks.find(
      (b) => String(b._id) === String(borrowId)
    );
    assert(adminRecord, "Returned borrow not in admin catalog");
    assert(adminRecord.receiptNumber === receiptNumber, "Catalog receipt mismatch");
    assert(adminRecord.book?.title, "Admin list missing populated book title");
    assert(adminRecord.book?.author, "Admin list missing populated book author");
    console.log("8) Admin catalog has receipt + book title/author");

    const myBooks = await jsonFetch(`${API}/borrow/my-borrowed-books`, {
      method: "GET",
      headers: { Cookie: userCookie },
    });
    assert(myBooks.res.ok, `My books failed: ${JSON.stringify(myBooks.body)}`);
    const mine = myBooks.body.borrowedBooks.find(
      (b) => String(b.borrowId) === String(borrowId) || b.receiptNumber === receiptNumber
    );
    assert(mine, "Student list missing returned borrow");
    assert(mine.returned === true, "Student record not marked returned");
    assert(mine.receiptNumber === receiptNumber, "Student receipt mismatch");
    assert(mine.paymentStatus === "Paid", "Student paymentStatus mismatch");
    assert(mine.returnDate, "Student returnDate missing");
    assert(mine.studentName, "Student name not enriched");
    assert(mine.studentEmail === USER_EMAIL, "Student email not enriched");
    console.log("9) Student list enriched with receipt fields");

    const unpaid = await jsonFetch(`${API}/borrow/payment-status/${borrowId}`, {
      method: "PUT",
      headers: { Cookie: adminCookie },
      body: JSON.stringify({ paymentStatus: "Unpaid" }),
    });
    assert(unpaid.res.ok, `Unpaid update failed: ${JSON.stringify(unpaid.body)}`);
    assert(unpaid.body.borrow.paymentStatus === "Unpaid", "Unpaid not applied");
    assert(unpaid.body.borrow.paidAt == null, "paidAt should clear on Unpaid");
    console.log("10) Payment status → Unpaid OK");

    const paidAgain = await jsonFetch(`${API}/borrow/payment-status/${borrowId}`, {
      method: "PUT",
      headers: { Cookie: adminCookie },
      body: JSON.stringify({ paymentStatus: "Paid" }),
    });
    assert(paidAgain.res.ok, `Paid update failed: ${JSON.stringify(paidAgain.body)}`);
    assert(paidAgain.body.borrow.paymentStatus === "Paid", "Paid not re-applied");
    assert(paidAgain.body.borrow.paidAt, "paidAt not set on re-Paid");
    console.log("11) Payment status → Paid OK");

    const forbidden = await jsonFetch(`${API}/borrow/payment-status/${borrowId}`, {
      method: "PUT",
      headers: { Cookie: userCookie },
      body: JSON.stringify({ paymentStatus: "Unpaid" }),
    });
    assert(
      forbidden.res.status === 403 ||
        forbidden.res.status === 401 ||
        forbidden.res.status === 400,
      `Expected 400/401/403 for student payment update, got ${forbidden.res.status}`
    );
    console.log("12) Student blocked from payment-status update");

    const fe = await fetch("http://127.0.0.1:5173/");
    assert(fe.ok, `Frontend not OK: ${fe.status}`);
    const receiptModule = await fetch(
      "http://127.0.0.1:5173/src/popups/ReceiptPopup.jsx"
    );
    assert(receiptModule.ok, `ReceiptPopup module not served: ${receiptModule.status}`);
    const receiptSrc = await receiptModule.text();
    assert(
      receiptSrc.includes("receipt-print-area"),
      "ReceiptPopup missing print area id"
    );
    assert(
      receiptSrc.includes("Download PDF"),
      "ReceiptPopup missing Download PDF"
    );
    assert(
      receiptSrc.includes("computer-generated receipt"),
      "ReceiptPopup missing footer"
    );
    console.log("13) Frontend + ReceiptPopup module OK");

    console.log("\n=== ALL E2E CHECKS PASSED ===");
    console.log(
      JSON.stringify(
        {
          receiptNumber,
          borrowId,
          total: 50 + (returnRes.body.borrow.fine || 0),
          paymentStatus: "Paid",
        },
        null,
        2
      )
    );
  } finally {
    if (borrowId) await Borrow.deleteOne({ _id: borrowId });
    await Borrow.deleteMany({ "user.email": { $in: [ADMIN_EMAIL, USER_EMAIL] } });
    await Book.deleteOne({ _id: book._id });
    await User.deleteOne({ _id: admin._id });
    await User.deleteOne({ _id: student._id });
    await mongoose.disconnect();
    console.log("\nCleanup done.");
  }
}

main().catch((err) => {
  console.error("\n=== E2E FAILED ===");
  console.error(err);
  process.exit(1);
});
