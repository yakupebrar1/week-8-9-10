-- Exercise 03: Joins
-- Databases: school.db and library.db

.headers on
.mode column

-- 3.1: Student full name + course title for every enrollment (school.db)
SELECT students.first_name || ' ' || students.last_name AS student_name, courses.title
FROM students
JOIN enrollments ON students.id = enrollments.student_id
JOIN courses ON enrollments.course_id = courses.id;

-- 3.2: Course title + teacher's full name (school.db)
SELECT courses.title, teachers.first_name || ' ' || teachers.last_name AS teacher_name
FROM courses
JOIN teachers ON courses.teacher_id = teachers.id;

-- 3.3: Teacher's full name + their department name (school.db)
SELECT teachers.first_name || ' ' || teachers.last_name AS teacher_name, departments.name
FROM teachers
JOIN departments ON teachers.department_id = departments.id;

-- 3.4: Student name, course title, teacher name, letter grade (school.db)
SELECT 
    s.first_name || ' ' || s.last_name AS student,
    c.title,
    t.first_name || ' ' || t.last_name AS teacher,
    e.grade
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id
JOIN teachers t ON c.teacher_id = t.id;

-- 3.5: Students with NO enrollments (LEFT JOIN) (school.db)
SELECT s.first_name, s.last_name
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
WHERE e.student_id IS NULL;

-- 3.6: Courses with NO students enrolled (LEFT JOIN) (school.db)
SELECT c.title
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
WHERE e.course_id IS NULL;

-- 3.7: Book title + author's full name (library.db)
SELECT b.title, a.first_name || ' ' || a.last_name AS author_name
FROM books b
JOIN authors a ON b.author_id = a.id;

-- 3.8: Genre name + all books in that genre (include empty genres) (library.db)
SELECT g.name AS genre, b.title
FROM genres g
LEFT JOIN books b ON g.id = b.genre_id;

-- 3.9: Member full name + every book they borrowed (include non-borrowers) (library.db)
SELECT m.first_name || ' ' || m.last_name AS member_name, b.title
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
LEFT JOIN books b ON l.book_id = b.id;

-- 3.10 CHALLENGE: Loans with member name, book title, dates (library.db)
--      Use COALESCE to show "Not returned" if return_date is NULL
SELECT 
    m.first_name || ' ' || m.last_name AS member_name,
    b.title,
    l.loan_date,
    COALESCE(l.return_date, 'Not returned') AS status
FROM loans l
JOIN members m ON l.member_id = m.id
JOIN books b ON l.book_id = b.id;