
# 📚 BookFlow - Library Management System

A modern **Library Management System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. The application provides role-based access for Admins, Librarians, and Users with secure authentication, book management, borrowing records, fine calculation, and optional face recognition login.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- Login & Logout
- Email OTP Verification
- Forgot Password
- Reset Password
- JWT Authentication
- Secure Cookie Authentication
- Optional Face Recognition Login

### 👥 User Roles

- **Admin**
  - Manage Users
  - Manage Librarians
  - Manage Books
  - View Library Statistics

- **Librarian**
  - Add Books
  - Update Books
  - Delete Books
  - Issue Books
  - Return Books

- **User**
  - Browse Books
  - Borrow Books
  - Return Books
  - View Borrow History
  - View Outstanding Fine

---

## 📖 Library Features

- Add New Books
- Update Book Information
- Delete Books
- Search Books
- Book Details
- Semester-wise Books
- Course-wise Books
- Book Availability Status

---

## 📚 Borrowing System

- Borrow Books
- Return Books
- Borrow History
- Due Date Tracking
- Automatic Fine Calculation
- Outstanding Fine Dashboard

---

## 📊 Dashboard

### Admin Dashboard
- Total Users
- Total Librarians
- Total Books
- Borrowed Books
- Returned Books
- Outstanding Fine
- Interactive Charts

### User Dashboard
- Borrowed Books
- Returned Books
- Fine Details
- Borrow Statistics

---

## 🛠 Tech Stack

### Frontend
- React.js
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- Chart.js
- React Toastify
- React Icons
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- Nodemailer

---

# 📂 Project Structure

```text
BookFlow/
│
├── client/
│   ├── public/
│   │   ├── models/
│   │   ├── Logo-B.png
│   │   └── Logo-R.png
│   │
│   ├── src/
│   │
│   │── assets/
│   │
│   │── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── Admins.jsx
│   │   ├── BookManagement.jsx
│   │   ├── Catalog.jsx
│   │   ├── FaceCapture.jsx
│   │   ├── Librarians.jsx
│   │   ├── MyBorrowedBooks.jsx
│   │   ├── UserDashboard.jsx
│   │   └── Users.jsx
│   │
│   │── layout/
│   │   ├── Header.jsx
│   │   └── SideBar.jsx
│   │
│   │── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── OTP.jsx
│   │   └── ResetPassword.jsx
│   │
│   │── popups/
│   │   ├── AddBookPopup.jsx
│   │   ├── AddNewAdmin.jsx
│   │   ├── AddNewLibrarian.jsx
│   │   ├── ReadBookPopup.jsx
│   │   ├── RecordBookPopup.jsx
│   │   ├── ReturnBookPopup.jsx
│   │   └── SettingPopup.jsx
│   │
│   │── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── bookSlice.js
│   │   │   ├── borrowSlice.js
│   │   │   ├── popUpSlice.js
│   │   │   └── userSlice.js
│   │   │
│   │   └── store.js
│   │
│   │── utils/
│   │   ├── courses.js
│   │   ├── faceApi.js
│   │   ├── fineCalculator.js
│   │   ├── roles.js
│   │   └── semesters.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── config.env
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── borrowController.js
│   │   └── userController.js
│   │
│   ├── database/
│   │   └── db.js
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │   ├── authRouter.js
│   │   ├── bookRouter.js
│   │   ├── borrowRouter.js
│   │   └── userRouter.js
│   │
│   ├── services/
│   │
│   ├── utils/
│   │   ├── courses.js
│   │   ├── emailTemplates.js
│   │   ├── faceMatcher.js
│   │   ├── fineCalculator.js
│   │   ├── sendEmail.js
│   │   ├── sendToken.js
│   │   └── sendVerificationCode.js
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── README.md
└── package.json
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/bookflow-library-management.git
```

## Install Frontend

```bash
cd client
npm install
```

## Install Backend

```bash
cd server
npm install
```

---

# Environment Variables

Create a **config.env** file inside the **server/config/** directory.

```env
PORT=4000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRE=7d

COOKIE_EXPIRE=7

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_MAIL=your_email
SMTP_PASSWORD=your_password

FRONTEND_URL=http://localhost:5173
```

---

# Run the Project

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

---

# Future Improvements
- QR Code Based Book Issue
- Barcode Scanner
- PDF Reports
- Email Due Reminder
- Book Reservation
- Analytics Dashboard
- Mobile Responsive Improvements

---

# Author

**Lakshya Pratap Shekhawat**

BCA (Full Stack)

Apex University

📧 lakshaypratapsinghshekhawat64@gmail.com

🔗 https://github.com/lakshaypratapsingh03

---

# License

This project is developed for educational, internship, and portfolio purposes.
