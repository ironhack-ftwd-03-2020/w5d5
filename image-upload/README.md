Open an account here: https://cloudinary.com/

The form has to have enctype="multipart/form-data" 

```
$ touch config/cloudinary.js
```

```
$ npm install cloudinary multer multer-storage-cloudinary
```

```
// in config/cloudinary.js
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

var storage = cloudinaryStorage({
  cloudinary,
  folder: 'movies-app',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, res, cb) {
    cb(null, res.originalname);
  }
});

const uploader = multer({ storage });

module.exports = uploader;
```

Enter the credentials in the .env file

Require cloudinary in routes/index.js



```
// routes/index.js
const uploader = require("../config/cloudinary.js");
```

And add the route to add a movie
```
// routes/index.js - 'photo' - is the name attribute from the form 
router.post("/movie/add", uploadCloud.single("photo"), (req, res, next) => {
  const { title, description } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;

  Movie.create({ title, description, imgPath, imgName })
    .then(movie => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
});
```

Add the image tag to the index view

```
// views/index.js
<img src="{{this.imgPath}}" alt="">
```

Deleting the image on Cloudinary when deleting the movie

```
// in views/index.js
<a href="/movie/delete/{{this._id}}">❌</a>
```

```
// in routes/index.js
router.get('/movie/delete/:id', (req, res) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(error);
    });
});
```

We have to add this to the delete route, the image is deleted via the public id 

```
if (movie.imgPath) {
  cloudinary.uploader.destroy(movie.imgPublicId);
}
```

Therefore we need to add the public id to the model when we create

```
// in models/Movie.js
    imgPublicId: String
```

We need to get the public id

```
// routes/index.js 
const imgPublicId = req.file.public_id;

Movie.create({ title, description, imgPath, imgName, imgPublicId })
```