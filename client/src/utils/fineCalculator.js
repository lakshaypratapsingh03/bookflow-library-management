export const calculateFine = (dueDate) => {
  const finePerHour = 0.1;
  const today = new Date();
  const due = new Date(dueDate);

  if (today > due) {
    const lateHours = Math.ceil((today - due) / (1000 * 60 * 60));
    return lateHours * finePerHour;
  }
  return 0;
};

export const getFineForBorrowRecord = (record) => {
  if (!record) return 0;
  if (record.returnDate) {
    return record.fine ?? 0;
  }
  return calculateFine(record.dueDate);
};

export const getFineForUserBorrowedBook = (book) => {
  if (!book) return 0;
  if (book.returned) {
    return book.fine ?? 0;
  }
  return calculateFine(book.dueDate);
};

export const formatPriceWithFine = (price = 0, fine = 0) => {
  const bookPrice = Number(price) || 0;
  const fineAmount = Number(fine) || 0;

  if (fineAmount > 0) {
    return `₹${bookPrice} + ₹${fineAmount.toFixed(1)}`;
  }
  return `₹${bookPrice}`;
};
