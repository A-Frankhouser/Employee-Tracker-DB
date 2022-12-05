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


