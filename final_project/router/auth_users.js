const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    const username = req.session.username; // Assuming you have a session setup with the username
    const newReview = req.query.review; // Assuming the review is provided as a query parameter
  
    if (username) {
      let book = books[isbn];
  
      if (book) {
        let reviews = book["reviews"] || [];
  
        // Check if the user has already posted a review for the given ISBN
        const existingReviewIndex = reviews.findIndex(review => review.username === username);
  
        if (existingReviewIndex !== -1) {
          // Modify the existing review if the user has already posted a review
          reviews[existingReviewIndex].text = newReview;
          res.send(`Review for book with ISBN ${isbn} modified for user ${username}.`);
        } else {
          // Add a new review for the user if they haven't posted a review yet
          const newReviewObject = {
            username: username,
            text: newReview
          };
  
          reviews.push(newReviewObject);
          book["reviews"] = reviews;
          books[isbn] = book;
  
          res.send(`Review for book with ISBN ${isbn} added for user ${username}.`);
        }
      } else {
        res.status(404).send("Unable to find book!");
      }
    } else {
      res.status(401).send("Unauthorized. Please log in to add or modify a review.");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Assuming you have a session setup with the username
  
    if (username) {
      let book = books[isbn];
  
      if (book) {
        let reviews = book["reviews"];
  
        if (reviews && reviews.length > 0) {
          // Filter reviews based on the session username
          const filteredReviews = reviews.filter(review => review.username === username);
  
          if (filteredReviews.length > 0) {
            // Remove the reviews associated with the session username
            book["reviews"] = reviews.filter(review => review.username !== username);
            
            books[isbn] = book;
            res.send(`Review(s) for book with ISBN ${isbn} deleted for user ${username}.`);
          } else {
            res.status(404).send("No reviews found for the specified book and user.");
          }
        } else {
          res.status(404).send("No reviews found for the specified book.");
        }
      } else {
        res.status(404).send("Unable to find book!");
      }
    } else {
      res.status(401).send("Unauthorized. Please log in to delete a review.");
    }
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
