const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.json(books);
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
