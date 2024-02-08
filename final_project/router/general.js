const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});



// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Use Axios to make a GET request to fetch the list of books
    const response = await axios.get('your_books_api_endpoint'); // Replace 'your_books_api_endpoint' with the actual API endpoint for fetching books

    // Assuming the response contains the list of books
    const books = response.data;

    // Send the list of books as a JSON response
    return res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error('Error fetching books:', error.message);
    // Handle the error and send an appropriate response
    return res.status(500).send('Error fetching books');
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    // Extract ISBN from request parameters
    const isbn = req.params.isbn;

    // Use Axios to make a GET request to fetch book details based on ISBN
    const response = await axios.get(`your_book_details_api_endpoint/${isbn}`); // Replace 'your_book_details_api_endpoint' with the actual API endpoint for fetching book details by ISBN

    // Assuming the response contains the book details
    const bookDetails = response.data;

    // Send the book details as a JSON response
    return res.send(JSON.stringify(bookDetails, null, 4));
  } catch (error) {
    console.error('Error fetching book details:', error.message);
    // Handle the error and send an appropriate response
    return res.status(500).send('Error fetching book details');
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    // Extract author from request parameters
    const author = req.params.author;

    // Use Axios to make a GET request to fetch book details based on author
    const response = await axios.get(`your_books_by_author_api_endpoint/${author}`); // Replace 'your_books_by_author_api_endpoint' with the actual API endpoint for fetching books by author

    // Assuming the response contains the book details
    const booksByAuthor = response.data;

    // Send the book details as a JSON response
    return res.send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    console.error('Error fetching books by author:', error.message);
    // Handle the error and send an appropriate response
    return res.status(500).send('Error fetching books by author');
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    // Extract title from request parameters
    const title = req.params.title;

    // Use Axios to make a GET request to fetch all books based on title
    const response = await axios.get(`your_books_by_title_api_endpoint/${title}`); // Replace 'your_books_by_title_api_endpoint' with the actual API endpoint for fetching books by title

    // Assuming the response contains the book details
    const booksByTitle = response.data;

    // Send the book details as a JSON response
    return res.send(JSON.stringify(booksByTitle, null, 4));
  } catch (error) {
    console.error('Error fetching books by title:', error.message);
    // Handle the error and send an appropriate response
    return res.status(500).send('Error fetching books by title');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
