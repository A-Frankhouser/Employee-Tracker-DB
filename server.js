const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to mysql-----------------------
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Aiden0101',
        database: 'employee_db'
    }
);
// ---------------------------------------

connection.connect(function (err) {
    if (err) return console.log(err);
    InquirerPrompt();
});

// Inquirer Prompt------------------------------------
const InquirerPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'Add employee',
                'Update employee information',
                'View all roles',
                'Add role',
                'View all departments',
                'Add department',
                'Quit'
            ]
        }
])
// ---------------------------------------------------
    .then((answers) => {
        const {choices} = answers;

        if (choices === 'View all employees') {
            showEmployees();
        };

        if (choices === 'Add employee') {
            addEmployees();
        };

        if (choices === 'Update employee information') {
            employeeInformation();
        };

        if (choices === 'View all roles') {
            showRoles();
        };

        if (choices === 'Add role') {
            addRoles();
        };

        if (choices === 'View all departments') {
            showDepartments();
        };

        if (choices === 'Add department') {
            addDepartment();
        };

        if (choices === 'Quit') {
            connection.end();
        };
    });
};
// -------------------------------------------------------

// Show Departments
showDepartments = () => {
    console.log("Showing all departments.");
    const mysql = `SELECT department.id AS ID, department.name AS Department FROM department`;

    connection.query(mysql, (err, rows) => {
        if(err) return console.log(err);
        console.table(rows);
        InquirerPrompt();
    })
};
// -------------------------------------------

// Show Roles
showRoles = () => {
    console.log('Displaying all roles');
    const mysql = `Select role.id, 
                    role.title, 
                    department.name AS Department 
                    FROM role INNER JOIN department ON role.department_id = department.id`;

    connection.query(mysql,(err,rows) => {
        console.table(rows);
        InquirerPrompt();
    })
};
// -------------------------------------------

// Add Roles
addRoles = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roles',
            message: 'What role would you like to add?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the yearly salary?',
        }
    ])

    .then(answer => {
        const parameters = [answer.roles, answer.salary];
        const roles_var =  `SELECT name, id FROM department`;

        connection.query(roles_var, (err, data) => {
            if (err) return console.log(err);
            const department_var = data.map (({ name, id }) => ({name: name, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department_var',
                    message: 'What department is this role for?',
                    choices: department_var
                }
            ])

            .then(department_varChoice => {
                const department_var = department_varChoice.department_var;
                parameters.push(department_var);
                const mysql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;

                connection.query(mysql, parameters, (err, result) => {
                    if(err) return console.log(err);
                    console.log('Added' + answer.roles + 'to roles');
                    showRoles();
                });
            });
        });
    });
};
// -------------------------------------------


// show employees
showEmployees = () => {
    console.log('All employees are now showing');
    const mysql = `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, role.title, 
                    department.name AS department,
                    role.salary, 
                    CONCAT(mgr.first_name, " ", mgr.last_name) 
                    AS manager 
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id 
                    LEFT JOIN employee mgr ON employee.manager_id = mgr.id`;

    connection.query(mysql, (err, rows) => {
        if(err) return console.log(err);
        console.table(rows);
        InquirerPrompt();
    });
};
// -------------------------------------------

// Update Employees
employeeInformation = () => {
    const employeemysql = `SELECT * FROM employee`;
    connection.query(employeemysql, (err, data) => {
        const employees = data.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id }));

        // Inquirer Prompt
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee would you like to update?',
                choices: employees
            }
        ])

        .then(employeeChoice => {
            const employee = employeeChoice.name;
            const parameters = [];
            parameters.push(employee);

            const roles_var = `SELECT * FROM role`;

            connection.query(roles_var, (err, data) => {
                if(err) return console.log(err);
                const roles = data.map(({id, title}) => ({name:title, value:id}));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the new role?',
                        choices: roles
                    }
                ])
                .then(roleChoice => {
                    const role = roleChoice.role;
                    parameters.push(role);
                    let employee = parameters[0];
                    parameters[0] = role;
                    parameters[1] = employee;
                    const mysql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(mysql, parameters, (err, result) => {
                        if (err) return console.log(err);
                        console.log('Employee role has been updated!');

                        showEmployees();
                    })
                })
            })
        });
    });
};
// -------------------------------------------

// Update or Add a department
addDepartment = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department you would like to add?'
        }
    ])
    
    .then(answer => {
        const mysql = `INSERT INTO department (name) VALUES (?)`;
        connection.query(mysql, answer.department, (err, results) => {
            if(err) return console.log(err);
            console.log('Added' + answer.department + "to departments");

            showDepartments();
        })
    })
};
// -------------------------------------------

// Add an employee
addEmployees = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name?'
        }
    ])
    .then(answer => {
        const parameters = [answer.first_name, answer.last_name];
        const roles_var = `SELECT role.id, role.title FROM role`;
        connection.query(roles_var, (err, data) => {
            if(err) return console.log(err);
            const roles = data.map(({id, title}) => ({name: title, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employee role?',
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                parameters.push(role);

            const sql = `INSERT INTO employee (first_name, last_name, role_id)
                        Values (?,?,?)`;
            
            connection.query(sql, parameters, (err, result) => {
                if (err) throw err;
                console.log('Employee has been added!');
            })
                showEmployees();
            });
        });
    });
};
