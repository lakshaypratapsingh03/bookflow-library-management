import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import OTP from "./pages/OTP.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice.js";
import { fetchAllUsers } from "./store/slices/userSlice.js";
import { fetchAllBooks } from "./store/slices/bookSlice.js";
import { fetchAllBorrowedBooks, fetchUserBorrowedBooks } from "./store/slices/borrowSlice.js";
import { isStaff, isUser } from "./utils/roles.js";




const App = () => {

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchAllBooks());
    if (isAuthenticated && isUser(user?.role)) {
      dispatch(fetchUserBorrowedBooks());
    }
    if (isAuthenticated && isStaff(user?.role)) {
      dispatch(fetchAllUsers());
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, isAuthenticated, user?.role]);

  return <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/otp-verification/:email" element={<OTP />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />
    </Routes>
    <ToastContainer theme="dark" />
  </Router>;
};

export default App;
