-- Exercise 07: Advanced SQL
-- Databases: school.db and library.db

.headers on
.mode column

-- 7.1: Create an index on students.gpa, then EXPLAIN QUERY PLAN
CREATE INDEX idx_student_gpa ON students(gpa);

EXPLAIN QUERY PLAN
SELECT * FROM students WHERE gpa > 3.8;

-- 7.2: Create view 'enrollment_details', then query for 'A' grades
CREATE VIEW enrollment_details AS
SELECT s.first_name, s.last_name, c.title, e.grade
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id;

SELECT * FROM enrollment_details WHERE grade = 'A';

-- 7.3: Create view 'course_statistics' with count and avg final score
CREATE VIEW course_statistics AS
SELECT c.title, COUNT(e.student_id) AS student_count, AVG(e.score) AS avg_score
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id;

-- 7.4: Insert a new student (newstudent@school.edu, 2024, NULL gpa)
INSERT INTO students (first_name, last_name, email, enrollment_year, gpa)
VALUES ('New', 'Student', 'newstudent@school.edu', 2024, NULL);

-- 7.5: Update student id=17 (Quinn Moore) to set gpa = 3.22
UPDATE students
SET gpa = 3.22
WHERE id = 17;

-- 7.6: Preview and then DELETE all grades with letter_grade = 'F'
-- Step 1: SELECT to preview
SELECT * FROM enrollments WHERE grade = 'F';

-- Step 2: DELETE
DELETE FROM enrollments WHERE grade = 'F';

-- 7.7: Transaction to enroll student 1 in course 13 + add grade record
BEGIN TRANSACTION;
INSERT INTO enrollments (student_id, course_id, grade)
VALUES (1, 13, NULL);
-- Add other related operations here if necessary
COMMIT;

-- 7.8: Transaction: decrease available_copies for book 3, insert loan (library.db)
BEGIN TRANSACTION;
UPDATE books
SET available_copies = available_copies - 1
WHERE id = 3 AND available_copies > 0;

INSERT INTO loans (book_id, member_id, loan_date)
VALUES (3, 101, DATE('now'));
COMMIT;

-- 7.9: EXPLAIN QUERY PLAN comparison
-- Version A:
EXPLAIN QUERY PLAN
SELECT * FROM students WHERE last_name LIKE '%son';

-- Version B:
EXPLAIN QUERY PLAN
SELECT * FROM students WHERE last_name = 'Johnson';

-- Your explanation of the difference:
-- Version A uses a leading wildcard (%), which forces a "SCAN TABLE" because the
-- index cannot determine where the string starts. Version B uses an exact match,
-- allowing the engine to "SEARCH TABLE" using the index (B-Tree), which is much faster.

-- 7.10 CHALLENGE: Create compound index for enrollments(student_id, course_id)
-- This speeds up queries filtering by both student and course, and can enforce uniqueness.
CREATE UNIQUE INDEX idx_student_course ON enrollments(student_id, course_id);
