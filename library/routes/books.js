const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const Book = require('../models/Book');

router.get('/books', (req, res) => {
  // get all the books
  // render a 'books' view with the books data

  Book.find().then(books => {
    res.render('books', { booksList: books });
  });
});

router.get('/books/add', (req, res) => {
  const authors = Author.find().then(authorsFromDB => {
    res.render('bookForm', { authors: authorsFromDB });
  }).catch(err => {
    console.log(err);
  })
});

router.get('/books/:bookId', (req, res) => {
  const bookId = req.params.bookId;

  Book.findById(bookId)
    .populate('author')
    .then(book => {
      console.log(book.author);
      res.render('bookDetails', { book: book });
    });
});

router.post('/books', (req, res, next) => {
  // const title = req.body.title;
  // const author = req.body.author;
  // const description = req.body.description;
  // const rating = req.body.rating;
  const { title, author, description, rating } = req.body;

  Book.create({
    title,
    author,
    description,
    rating,
  })
    .then(book => {
      console.log(`Success! ${title} was added to the database.`);
      // res.redirect('/books');
      res.redirect(`/books/${book._id}`);
    })
    .catch(err => {
      console.log('Error while adding a book to the DB');
      next(err);
    });
});

router.get('/books/edit/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId)
    .populate('author')
    .then(book => {
      // render the edit form with the data from the book
      res.render('bookEdit', { book: book });
    })
    .catch(err => {
      next(err);
    });
});

router.post('/books/edit/:bookId', (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const author = req.body.author;
  const rating = req.body.rating;

  Book.findByIdAndUpdate(req.params.bookId, {
    title,
    description,
    author,
    rating
  })
    .then(book => {
      //   res.redirect('/books')
      res.redirect(`/books/${book._id}`); // book._id === req.params.bookId
    })
    .catch(err => {
      next(err);
    });
});

router.post('/books/:bookId/reviews', (req, res, next) => {
  const { user, comments } = req.body;
  Book.update({ _id: req.params.bookId }, { $push: { reviews: { user, comments } } })
    .then(book => {
      res.redirect('/books')
    })
    .catch((error) => {
      console.log(error)
    })
});

module.exports = router;
