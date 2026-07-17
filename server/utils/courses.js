export const COURSE_CATALOG = [
  {
    name: "B.Tech (CSE)",
    duration: "4 Years",
    semesters: 8,
    specializations: [
      { label: "Computer Science", value: "B.Tech (CSE)" },
    ],
  },
  {
    name: "BCA",
    duration: "3 Years",
    semesters: 6,
    specializations: [
      { label: "General", value: "BCA - General" },
      { label: "Full Stack Development", value: "BCA Full Stack" },
      { label: "Data Science", value: "BCA Data Science" },
    ],
  },
  {
    name: "MCA",
    duration: "2 Years",
    semesters: 4,
    specializations: [
      { label: "Computer Applications", value: "MCA" },
    ],
  },
  {
    name: "B.Com",
    duration: "3 Years",
    semesters: 6,
    specializations: [
      { label: "General", value: "B.Com" },
      { label: "Accounting", value: "B.Com - Accounting" },
      { label: "Finance", value: "B.Com - Finance" },
    ],
  },
  {
    name: "B.Sc. Computer Science",
    duration: "3 Years",
    semesters: 6,
    specializations: [
      { label: "Computer Science", value: "B.Sc. Computer Science" },
    ],
  },
  {
    name: "B.Sc. IT",
    duration: "3 Years",
    semesters: 6,
    specializations: [
      { label: "Information Technology", value: "B.Sc. IT" },
    ],
  },
  {
    name: "BBA",
    duration: "3 Years",
    semesters: 6,
    specializations: [
      { label: "General", value: "BBA" },
      { label: "Marketing", value: "BBA - Marketing" },
      { label: "Finance", value: "BBA - Finance" },
      { label: "HR", value: "BBA - HR" },
    ],
  },
  {
    name: "MBA",
    duration: "2 Years",
    semesters: 4,
    specializations: [
      { label: "Finance", value: "MBA - Finance" },
      { label: "Marketing", value: "MBA - Marketing" },
      { label: "HR", value: "MBA - HR" },
      { label: "Business Analytics", value: "MBA - Business Analytics" },
    ],
  },
];

export const COURSES = COURSE_CATALOG.flatMap((course) =>
  course.specializations.map((spec) => spec.value)
);

export const COURSE_ALIASES = {
  "B.Tech (CSE)": ["B.Tech (CSE)", "BTech"],
  "B.Sc. Computer Science": ["B.Sc. Computer Science", "B.Sc."],
  "BCA Full Stack": ["BCA Full Stack"],
  "BCA Data Science": ["BCA Data Science"],
  "B.Com": ["B.Com"],
  "B.Com - Accounting": ["B.Com - Accounting", "B.Com"],
  "B.Com - Finance": ["B.Com - Finance", "B.Com"],
  "BBA": ["BBA"],
  "BBA - Marketing": ["BBA - Marketing", "BBA"],
  "BBA - Finance": ["BBA - Finance", "BBA"],
  "BBA - HR": ["BBA - HR", "BBA"],
  "MBA - Finance": ["MBA - Finance", "MBA"],
  "MBA - Marketing": ["MBA - Marketing", "MBA"],
  "MBA - HR": ["MBA - HR", "MBA"],
  "MBA - Business Analytics": ["MBA - Business Analytics", "MBA"],
};

export const getCourseByValue = (value) =>
  COURSE_CATALOG.find((course) =>
    course.specializations.some((spec) => spec.value === value)
  );

export const getMaxSemester = (courseValue) => {
  const course = getCourseByValue(courseValue);
  return course?.semesters ?? 8;
};

export const isValidCourse = (course) => COURSES.includes(course);

export const isValidCourseSemester = (courseValue, semester) => {
  const value = Number(semester);
  if (!Number.isInteger(value) || value < 1) return false;
  return value <= getMaxSemester(courseValue);
};

export const getCourseQueryValues = (courseValue) =>
  COURSE_ALIASES[courseValue] || [courseValue];
