export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const isValidSemester = (semester) => {
  const value = Number(semester);
  return Number.isInteger(value) && value >= 1 && value <= 8;
};

export const formatSemester = (semester) =>
  semester ? `Semester ${semester}` : "Not set";
