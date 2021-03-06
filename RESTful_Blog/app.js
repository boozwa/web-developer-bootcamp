// include packages and basic app config

var express = require('express'),
    app = express(),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
mongoose.connect('mongodb://localhost/restful_blog_app');


// mongoose schema config

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  blog: String,
  created: {type: Date, default: Date.now()}
})

// mongoose model config

var Blog = mongoose.model('Blog', blogSchema);


// RESTful routes

app.get('/', function(req, res) {
  res.redirect('/blogs');
})

// INDEX
app.get('/blogs', function(req, res) {
  // display all blogs
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err)
    } else {
      res.render('index', {blogs: blogs});
    }
  })
})

// NEW
app.get('/blogs/new', function(req, res) {
  // display new form
  res.render('newblog');
})

// CREATE
app.post('/blogs', function(req, res) {
  req.body.blog.blog = req.sanitize(req.body.blog.blog);
  // create new blog and save in database
  Blog.create(req.body.blog, function(err, blog) {
    if (err) {
      res.render('newblog');
    } else {
      res.redirect(201, '/blogs');
    }
  })
})

// SHOW
app.get('/blogs/:id', function(req, res) {
  // find the blog by id
  Blog.findById(req.params.id, function(err, blog) {
    if (err) {
      res.send('Oops something went wrong...' + err);
    } else {
      res.render('blog', {blog: blog});
    }
  })
})

// EDIT
app.get('/blogs/:id/edit', function(req, res) {
  // display edit form
  Blog.findById(req.params.id, function(err, blog) {
    if (err) {
      res.send('Cannot find blog...' + err)
    } else {
      res.render('editblog', {blog:blog});
    }
  })
})

// UPDATE
app.put('/blogs/:id', function(req, res) {
  req.body.blog.blog = req.sanitize(req.body.blog.blog);
  // update single blog and save in database
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
    if (err) {
      res.send('Cannot find and update blog...' + err);
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  })
})

// DESTROY
app.delete('/blogs/:id', function(req, res) {
  // delete single blog and redirect to all blogs
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.send('Cannot delete the blog...' + err)
    } else {
      res.redirect('/blogs');
    }
  })
})


app.listen(2000, function() {
  console.log('server is up at port 2000.');
})