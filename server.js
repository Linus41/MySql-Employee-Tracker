
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

// creates an employee
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
                console.log("Your new employee has been added", resOne);
                if (errOne) throw errOne;
                updateRole();
            }

        );

    });

}

//   creates a department
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

function createRole() {
    connection.query("SELECT name, id FROM department", function (errOne, resOne) {
        if (errOne) throw errOne;
        console.log("resOne result", resOne);
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

    function updateRole() {
        connection.query("SELECT title FROM role", function (errOne, resOne) {
            if (errOne) throw errOne;
            console.log("resOne result", resOne);
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "What role would you like to assign this employee?",
                    choices: resOne.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })

                }]).then(updatePrompt => {
                    connection.query(
                        "UPDATE role SET ? WHERE ?", role.title, employee.role_id,
                        [
                            {
                                role: updatePrompt.title
                            }
                        ],
                        function (errTwo, resTwo) {
                            if (errTwo) throw errTwo;
                            trackerChoices();
                        }
                    );
                });

        });

    }


    function deleteEmployee() {
        connection.query("SELECT * FROM products", function (errOne, resOne) {
            if (errOne) throw errOne;
            inquirer.prompt([
                {
                    type: "list",
                    name: "id",
                    message: "What Flavor Id do you want to delete?",
                    choices: resOne.map(product => {
                        return {
                            name: product.flavor,
                            value: product.id
                        }
                    })
                }]).then(deletePrompt => {
                    connection.query(
                        "DELETE FROM products WHERE ?",
                        {
                            id: deletePrompt.id
                        },
                        function (errTwo, resTwo) {
                            if (errTwo) throw errTwo;
                            iceCreamManager();
                        }
                    );
                });
        });
    }

    // display all employees
    function readEmployees() {
        connection.query("SELECT * FROM employee", function (err, res) {
            console.table(res)
            if (err) throw err;
            trackerChoices();
        });
    }
    //   display all departments
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
    // display table with all info
    // do I use joins here to create a table that shows everything?
    function viewTable() {
        connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id", function (err, res) {
            console.table(res)
            if (err) throw err;
            trackerChoices();
        });
    }

    //   asks user at beginning what they'd like to see: employees, depts, roles
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
                    name: "Update employee a role",
                    value: "updateRole"
                },
                {
                    name: "View table",
                    value: "everything",
                },
                {
                    name: "Quit",
                    value: "quit"
                }
            ]
            //   sends user to appropriate functions
        }]).then(actionPrompt => {
            // console.log(actionPrompt.choice)
            if (actionPrompt.choice === "readEmployees") {
                readEmployees();
            } else if (actionPrompt.choice === "addEmployee") {
                createEmployee();
            } else if (actionPrompt.choice === "readDepartments") {
                readDepartments();
            } else if (actionPrompt.choice === "addDepartment") {
                createDepartment();
            } else if (actionPrompt.choice === "readRoles") {
                readRoles();
            } else if (actionPrompt.choice === "addRole") {
                createRole();
            } else if (actionPrompt.choice === "everything") {
                viewTable();
            } else if (actionPrompt.choice === "updateRole") {
                updateRole();
            } else {
                console.log("goodbye");
                process.exit()
                return;
            }
        })
        // return;
        // console.table();
    }


