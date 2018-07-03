const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 8080,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "user_db"
  });

connection.connect(function(err) {
if (err) throw err;
console.log("connected as id " + connection.threadId + "\n");
createUser();
});

function createUser() {
console.log("Inserting a new product...\n");
var query = connection.query(
    "INSERT INTO users SET ?",
    {
    username: '',
    email: '',
    password: ''
    },
    function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " user inserted!\n");
        // Call updateProduct AFTER the INSERT completes
        updateUser();
    }
);

// logs the actual query being run
console.log(query.sql);
}

function updateUser() {
    console.log("Updating all user values...\n");
    var query = connection.query(
      "UPDATE users SET ? WHERE ?",
      [
        
      ],
      function(err, res) {
          if (err) throw err;
            console.log(res.affectedRows + " users updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            deleteUser();
      }
    );
  
    // logs the actual query being run
    console.log(query.sql);
  }

  function deleteUser() {
    console.log("Deleting user...\n");
    connection.query(
      "DELETE FROM users WHERE ?",
      {
        
      },
      function(err, res) {
        console.log(res.affectedRows + " user deleted!\n");
        // Call readProducts AFTER the DELETE completes
        readUser();
      }
    );
  }

  function readUser() {
    console.log("Selecting user...\n");
    connection.query("SELECT * FROM users", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
  }