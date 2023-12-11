const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  console.log(req.body);

  // Check if username and password are provided
  if (username && password) {
    // Check if the username exists and the password is correct
    if (isValid(username) && authenticatedUser(username, password)) {
      // Create a JWT token
      const token = jwt.sign(
        { username },
        "88066899917c1fdc7d9fe0aacb691d5b3a065aba4e5fee31c2abd66e2f39285c"
      );

      // Return the token in the response
      return res.status(200).json({ token });
    } else {
      // Return a 401 status (Unauthorized) for invalid credentials
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }

  // Return a 400 status (Bad Request) for missing username or password
  return res
    .status(400)
    .json({ message: "Username and password are required." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body;

  const reviewer = req.user.username; // Extracted username from JWT token
  console.log(reviewer);

  const book = Object.values(books).find((book) => book.isbn === isbn);

  // Check if the book with the provided ISBN exists
  if (book) {
    // Check if 'reviews' property exists and is an object
    if (!book.reviews || typeof book.reviews !== "object") {
      book.reviews = {}; // Initialize 'reviews' as an object if it doesn't exist or is not an object
    }

    // Check if the user has already reviewed this book
    if (book.reviews.hasOwnProperty(reviewer)) {
      // Update the existing review if the user has already reviewed this book
      book.reviews[reviewer] = review;
    } else {
      // Add a new review if the user has not reviewed this book before
      book.reviews[reviewer] = review;
    }

    // You might want to save the updated 'books' object to your database here if you're using one

    return res
      .status(200)
      .json({ message: "Review added or updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found this time" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const reviewer = req.user.username;

  const book = Object.values(books).find((book) => book.isbn === isbn);

  // Check if the book with the provided ISBN exists
  if (book) {
    // Check if 'reviews' property exists and is an object
    if (book.reviews && typeof book.reviews === "object") {
      // Check if the user has a review for this book
      if (book.reviews.hasOwnProperty(reviewer)) {
        // Delete the review
        delete book.reviews[reviewer];

        // You might want to save the updated 'books' object to your database here if you're using one

        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ message: "Review not found for the user" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "No reviews found for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
