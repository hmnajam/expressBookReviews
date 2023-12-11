const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  console.log(req.body);

  // Check if username and password are provided
  if (username && password) {
    // Check if the username exists and the password is correct
    if (isValid(username) && authenticatedUser(username, password)) {
      // Create a JWT token
      const token = jwt.sign({ username }, 'your_secret_key');

      // Return the token in the response
      return res.status(200).json({ token });
    } else {
      // Return a 401 status (Unauthorized) for invalid credentials
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }

  // Return a 400 status (Bad Request) for missing username or password
  return res.status(400).json({ message: "Username and password are required." })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
