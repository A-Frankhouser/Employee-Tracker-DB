-- Department Names
INSERT INTO department (name)
VALUES
    ('IT'),
    ('Sales/Marketing'),
    ('Engineering'),
    ('Customer Service'),
    ('Data Management');
-- // -------------------------------------------

-- Employee Roles
INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Data Engineer', 90000, 5),
    ('Data Analylist', 90000, 5),
    ('Customer Service', 60000, 4),
    ('Software Engineer', 100000, 3),
    ('Sales Rep', 85000, 2),
    ('IT specialist', 80000, 1),
    ('Cyber Security', 120000, 1);
-- // -------------------------------------------

-- Employees
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Bilbo', 'Baggins', 2,2),
    ('Thorin', 'Oakenshieldins', 1,1),
    ('Frodo', 'Baggins', 5,5),
    ('Dáin', 'Ironfoot',1,2),
    ('Balin', 'Oakenshieldins',1,5),
    ('Dwalin', 'Oakenshieldins',3,2),
    ('Oin', 'Oakenshieldins',1,5),
    ('Gloin', 'Oakenshieldins',4,1),
    ('Roäc', 'Carc',2,5),
    ('Alex', 'Frankhouser',3,2),
    ('Ian', 'Frankhouser',5,1),
    ('Katie', 'Frankhouser',4,null),
    ('Ahny', 'Frankhouser',3,1),
    ('Becky', 'Trowbridge',2,null),
    ('Hank' , 'Macneil',4,4),
    ('Miller', 'Light', 3,null),
    ('Aiden', 'Frankhouser',5,null)
-- // -------------------------------------------