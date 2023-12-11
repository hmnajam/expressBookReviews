const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);


  // Check if username and password are provided
  if (username && password) {
    // Check if the username already exists
    if (!isValid(username)) {
      // Assuming isValid checks if the username exists in the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      // Return a 409 status (Conflict) for user already exists
      return res.status(409).json({ message: "User already exists!" });
    }
  }

  // Return a 400 status (Bad Request) for missing username or password
  return res
    .status(400)
    .json({ message: "Username and password are required." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("your_api_endpoint");
    // Handle the response data
    res.json(response.data);
  } catch (error) {
    // Log the detailed error for debugging
    console.error("Error fetching book list:", error);

    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED') {
      res.status(500).send("Connection Refused: Unable to connect to the server.");
    } else {
      // Handle other types of errors
      res.status(500).send("Internal Server Error");
    }
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = Object.values(books).find((book) => book.isbn === isbn);

  if (book) {
    return res.json(book);
  } else {
    // If the ISBN is not found
    res.status(404).json({ error: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );

  if (booksByAuthor.length > 0) {
    return res.json(booksByAuthor);
  } else {
    // If the author is not found
    res.status(404).json({ error: "Books not found for the specified author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const book = Object.values(books).find((book) => book.title === title);
  if (book) {
    return res.json(book);
  } else {
    // If the title is not found
    res.status(404).json({ error: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = Object.values(books).find((book) => book.isbn === isbn);

  // Check if the book with the given ISBN exists
  if (book) {
    const reviews = book.reviews || {};
    return res.json(reviews);
  } else {
    // If the book with the given ISBN is not found
    res.status(404).json({ error: "Book not found" });
  }
});

module.exports.general = public_users;
