-- Exercise 05: Subqueries
-- Databases: school.db and library.db

.headers on
.mode column

-- 5.1: Students with GPA above the average (school.db)
SELECT first_name, last_name, gpa
FROM students
WHERE gpa > (SELECT AVG(gpa) FROM students);

-- 5.2: Students enrolled in CS50 (use subquery) (school.db)
SELECT first_name, last_name
FROM students
WHERE id IN (
    SELECT student_id
    FROM enrollments
    WHERE course_id = (SELECT id FROM courses WHERE title = 'CS50')
);

-- 5.3: Students NOT enrolled in CS50 (school.db)
SELECT first_name, last_name
FROM students
WHERE id NOT IN (
    SELECT student_id
    FROM enrollments
    WHERE course_id = (SELECT id FROM courses WHERE title = 'CS50')
);

-- 5.4: Courses taught by the highest-paid teacher (school.db)
SELECT title
FROM courses
WHERE teacher_id = (SELECT id FROM teachers ORDER BY salary DESC LIMIT 1);

-- 5.5: Students enrolled in 3 or more courses (subquery in FROM) (school.db)
SELECT s.first_name, s.last_name, counts.course_count
FROM students s
JOIN (
    SELECT student_id, COUNT(*) AS course_count
    FROM enrollments
    GROUP BY student_id
) AS counts ON s.id = counts.student_id
WHERE counts.course_count >= 3;

-- 5.6: Members who borrowed more than 2 books (library.db)
SELECT first_name, last_name
FROM members
WHERE id IN (
    SELECT member_id
    FROM loans
    GROUP BY member_id
    HAVING COUNT(*) > 2
);

-- 5.7: Books with more pages than average (library.db)
SELECT title, pages
FROM books
WHERE pages > (SELECT AVG(pages) FROM books);

-- 5.8: Students with at least one grade (EXISTS) (school.db)
SELECT first_name, last_name
FROM students s
WHERE EXISTS (
    SELECT 1
    FROM enrollments e
    WHERE e.student_id = s.id AND e.grade IS NOT NULL
);

-- 5.9: Courses with no grades recorded (NOT EXISTS) (school.db)
SELECT title
FROM courses c
WHERE NOT EXISTS (
    SELECT 1
    FROM enrollments e
    WHERE e.course_id = c.id AND e.grade IS NOT NULL
);

-- 5.10 CHALLENGE: Course(s) with the most enrollments (no LIMIT) (school.db)
-- We find the maximum count first, then find courses that match that count
SELECT title
FROM courses
WHERE id IN (
    SELECT course_id
    FROM enrollments
    GROUP BY course_id
    HAVING COUNT(*) = (
        SELECT COUNT(*)
        FROM enrollments
        GROUP BY course_id
        ORDER BY COUNT(*) DESC
        LIMIT 1
    )
);
