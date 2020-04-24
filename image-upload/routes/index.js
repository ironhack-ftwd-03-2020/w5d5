const express = require("express");
const Movie = require("../models/movie.js");
const router = express.Router();
const { uploader, cloudinary } = require('../config/cloudinary.js');

router.get("/", (req, res, next) => {
  Movie.find()
    .then(movies => {
      res.render("index", { movies });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/movie/add", (req, res, next) => {
  res.render("movie-add");
});

// routes/index.js - 'photo' - is the name attribute from the form 
router.post("/movie/add", uploader.single("photo"), (req, res, next) => {
  const { title, description } = req.body;
  console.log(req.file);
  const imgPath = req.file.url;
  const imgPublicId = req.file.public_id;
  const imgName = req.file.originalname;

  Movie.create({ title, description, imgPath, imgName, imgPublicId })
    .then(movie => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/movie/delete/:id', (req, res) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(movie => {
      // if movie has an imgPath delete the image on cloudinary
      if (movie.imgPath) {
        cloudinary.uploader.destroy(movie.imgPublicId);
      }
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    })
});

module.exports = router;