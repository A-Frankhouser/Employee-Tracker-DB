const express = require('express');
const inquire = require('inquirer');
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
    inquirePrompt();
});

// Inquire Prompt------------------------------------
const inquirePrompt = () => {
    inquire.prompt([
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
        inquirePrompt();
    })
};

// Show Roles
showRoles = () => {
    console.log('Displaying all roles');
    const mysql = `Select roles.id, roles.title, department.name AS Department FROM roles LEFT JOIN department ON roles.department_id = department.id`;

    connection.query(mysql,(err,rows) => {
        console.table(rows);
        inquirePrompt();
    })
};

// Add Roles
addRoles = () => {
    inquire.prompt([
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

            inquire.prompt([
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
                const mysql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;

                connection.query(mysql, parameters, (err, result) => {
                    if(err) return console.log(err);
                    console.log('Added' + answer.roles + 'to roles');
                    showRoles();
                });
            });
        });
    });
};

