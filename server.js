
const mysql = require("mysql");
const inquirer = require("inquirer");



const PORT = process.env.PORT || 8080;

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "employeeTracker_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    trackerChoices();
});

// create an employee
function createEmployee() {
    inquirer.prompt([{
        type: "input",
        name: "first_name",
        message: "What is the new employee's first name?"
    },
    {
        type: "input",
        name: "last_name",
        message: "What is their last name?"
    }]).then(createPrompt => {
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: createPrompt.first_name,
                last_name: createPrompt.last_name,
            },
            function (errOne, resOne) {
                console.log("Your new employee has been added");
                if (errOne) throw errOne;
                trackerChoices();
            }
        );
    });
}

//   create a department
function createDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What department would you like to add?",

        }]).then(createPrompt => {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: createPrompt.name,

                },
                function (errOne, resOne) {
                    console.log("A new department has been added");
                    if (errOne) throw errOne;
                    trackerChoices();
                }
            );
        });
}

// create a role
function createRole() {
    connection.query("SELECT name, id FROM department", function (errOne, resOne) {
        if (errOne) throw errOne;
        inquirer.prompt([
            {
                type: "input",
                name: "role",
                message: "What role would you like to add?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary for this role?"
            },
            {
                type: "list",
                name: "departmentID",
                message: "What department does this role belong to?",
                choices: resOne.map(department => {
                    return {
                        name: department.name,
                        value: department.id
                    }
                })
            }
        ]).then(createPrompt => {
            connection.query(
                "INSERT INTO role SET ?",
                [
                    {
                        title: createPrompt.role,
                        salary: createPrompt.salary,
                        department_id: createPrompt.departmentID
                    }
                ],
                function (errTwo, resTwo) {
                    if (errTwo) throw errTwo;
                    console.log("A new role has been added")
                    trackerChoices();
                }
            );
        });
    })
}

// update employee role
function updateRole() {
    connection.query("SELECT first_name, last_name, id FROM employee", function (errOne, resOne) {
        connection.query("SELECT * FROM role", function (errTwo, resTwo) {
            if (errOne) throw errOne;
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Which employee would you like to update?",
                    // displays list of all employees
                    choices: resOne.map(employee => {
                        return {
                            name: employee.first_name + " " + employee.last_name,
                            value: employee.id
                        }
                    })
                },
                {
                    type: "list",
                    name: "newRole",
                    message: "What role would you like to assign this employee?",
                    choices: resTwo.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                }]).then(updatePrompt => {
                    connection.query(
                        "UPDATE employee SET role_id = ? WHERE id = ?",
                        [
                            updatePrompt.newRole,
                            updatePrompt.employee
                        ],
                        function (updateErr, update) {

                            if (updateErr) throw updateErr;
                            trackerChoices();
                        }
                    );
                });
        });
    })
}

function readDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        console.table(res)
        if (err) throw err;
        trackerChoices();
    });
}

//   display all roles
function readRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        console.table(res)
        if (err) throw err;
        trackerChoices();
    });
}
// display employees with all info
function readEmployees() {
    connection.query("SELECT first_name, last_name, employee.id, role.title, role.salary, department.name FROM employee INNER JOIN role ON role_id = role.id INNER JOIN department ON role.department_id = department.id", function (err, res) {
        console.table(res)
        if (err) throw err;
        trackerChoices();
    });
}

//  main menu
function trackerChoices() {
    inquirer.prompt([{
        message: "What would you like to do?",
        name: "choice",
        type: "list",
        choices: [
            {
                name: "Add a department",
                value: "addDepartment"
            },
            {
                name: "Add a role",
                value: "addRole"
            },
            {
                name: "Add an Employee",
                value: "addEmployee"
            },
            {
                name: "See all employees",
                value: "readEmployees"
            },

            {
                name: "See all departments",
                value: "readDepartments"
            },

            {
                name: "See all roles",
                value: "readRoles"
            },

            {
                name: "Assign an employee role",
                value: "updateRole"
            },
            {
                name: "Quit",
                value: "quit"
            }
        ]
    }]).then(actionPrompt => {
        if (actionPrompt.choice === "addEmployee") {
            createEmployee();
        } else if (actionPrompt.choice === "readDepartments") {
            readDepartments();
        } else if (actionPrompt.choice === "addDepartment") {
            createDepartment();
        } else if (actionPrompt.choice === "readRoles") {
            readRoles();
        } else if (actionPrompt.choice === "addRole") {
            createRole();
        } else if (actionPrompt.choice === "readEmployees") {
            readEmployees();
        } else if (actionPrompt.choice === "updateRole") {
            updateRole();
        } else {
            console.log("goodbye");
            process.exit()
            return;
        }
    })
}


