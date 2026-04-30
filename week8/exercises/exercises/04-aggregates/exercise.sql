-- Exercise 04: Aggregates
-- Databases: school.db and library.db

.headers on
.mode column

-- 4.1: Total number of students
SELECT COUNT(*) AS total_students
FROM students;

-- 4.2: Number of students per enrollment year
SELECT enrollment_year, COUNT(id) AS student_count
FROM students
GROUP BY enrollment_year;

-- 4.3: Average GPA (rounded to 2 decimal places)
SELECT ROUND(AVG(gpa), 2) AS average_gpa
FROM students;

-- 4.4: Highest GPA, lowest GPA, and average GPA in one query
SELECT
    MAX(gpa) AS highest_gpa,
    MIN(gpa) AS lowest_gpa,
    ROUND(AVG(gpa), 2) AS average_gpa
FROM students;

-- 4.5: Number of courses per department_id
SELECT department_id, COUNT(*) AS course_count
FROM courses
GROUP BY department_id;

-- 4.6: Number of students enrolled in each course (sorted by count desc)
SELECT course_id, COUNT(student_id) AS enrollment_count
FROM enrollments
GROUP BY course_id
ORDER BY enrollment_count DESC;

-- 4.7: Courses with more than 3 students enrolled (HAVING)
SELECT course_id, COUNT(student_id) AS student_count
FROM enrollments
GROUP BY course_id
HAVING student_count > 3;

-- 4.8: Average final exam score per course (rounded to 1 decimal)
-- Note: Assuming a 'score' column in the enrollments table
SELECT course_id, ROUND(AVG(score), 1) AS avg_score
FROM enrollments
GROUP BY course_id;

-- 4.9: Per department: teacher count, avg salary, max salary
SELECT
    department_id,
    COUNT(id) AS teacher_count,
    ROUND(AVG(salary), 2) AS avg_salary,
    MAX(salary) AS max_salary
FROM teachers
GROUP BY department_id;

-- 4.10: Total fines + avg fine for loans with fine > 0 (library.db)
SELECT
    SUM(fine_amount) AS total_fines,
    ROUND(AVG(fine_amount), 2) AS average_fine
FROM loans
WHERE fine_amount > 0;

-- 4.11: Number of books per genre_id (library.db)
SELECT genre_id, COUNT(*) AS book_count
FROM books
GROUP BY genre_id;

-- 4.12 CHALLENGE: Departments where avg salary > 75000 (school.db)
-- Joins the department name for better readability
SELECT d.name, ROUND(AVG(t.salary), 2) AS avg_salary
FROM departments d
JOIN teachers t ON d.id = t.department_id
GROUP BY d.name
HAVING avg_salary > 75000;
