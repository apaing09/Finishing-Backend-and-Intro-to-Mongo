const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// Express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://painga:painga6969@nodecc.0hm12hs.mongodb.net/nodecc?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));  

// register view engine
app.set('view engine', 'ejs');


// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded ({ extended: true }));
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});


// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
  });

app.get('/about',(req, res) => {
    res.render('about', { title: 'About' });
});

// blog routes

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
      .then((result) => {
        res.render('index', { title: 'Alll Blogs', blogs: result})
      })
      .catch((err) => {
        console.log(err);
      })
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) =>{
            console.log(err);
        })
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        console.log(err);
      });
  });

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new Blog' });
})

// 404 page

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
})