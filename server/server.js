// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,              // Allow cookies to be sent
}));
app.use(express.json());

const mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/phreddit";
mongoose.connect(mongoDB)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(session({
    secret: "temp",
    cookie: {httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000, secure: false},
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/phreddit'}),
}));

app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("User ID: " + req.session.userId);
  next();
});

const Community = require('./models/communities.js');
const Comments = require('./models/comments.js');
const LinkFlairs = require('./models/linkflairs.js');
const Posts = require('./models/posts.js');
const User = require('./models/users.js');

app.get('/communities', async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/comments', async (req, res) => {
  try {
    const comments = await Comments.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/linkflairs', async (req, res) => {
  try {
    const linkflairs = await LinkFlairs.find();
    res.status(200).json(linkflairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/create-post', async (req, res) => {
  try {
    // console.log(req.body);
    // console.log("create post");
    let postObject;
    if (req.body.linkFlairID == null) {
      postObject = {
        title: req.body.title,
        content: req.body.content,
        postedBy: req.body.postedBy,
      }
    } else {
      console.log(req.body.linkFlairID);
      let linkFlairObj = await LinkFlairs.findOne({content: req.body.linkFlairID});

      if (!linkFlairObj) {
        linkFlairObj = new LinkFlairs({content: req.body.linkFlairID});
        console.log(linkFlairObj);
        await linkFlairObj.save();
      }
      
      postObject = {
        title: req.body.title,
        content: req.body.content,
        linkFlairID: linkFlairObj,
        postedBy: req.body.postedBy,
      }
    }
    const communities = await Community.findOne({name: req.body.communityName});
    //console.log("community backend" + communities);
    
    let post = new Posts(postObject);
    //console.log(post);
    await post.save();

    communities.postIDs.push(post._id);
    await communities.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/create-community', async (req, res) => {
  try {
    console.log("inside" + typeof(req.body.members));
    let communityObj = {
      name: req.body.name,
      description: req.body.description,
      members: [req.body.members]
    }

    console.log(typeof(communityObj.members));

    let newCommunityObj = new Community(communityObj);
    await newCommunityObj.save();

    res.status(200).json(newCommunityObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/communities/:id', async (req, res) =>  {
  try {
    const community = await Community.findById(req.params.id);
    console.log("req id " + req.params.id);
    await community.save();
    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/comments', async (req, res) => {
  try {
    let commentObj = {
      content: req.body.content,
      commentedBy: req.body.commentedBy
    }
    
    const newCommentObj = new Comments(commentObj);
    await newCommentObj.save();

    if (req.body.isReply) {
      //if its a reply, then we want to find the commentID of the parent comment and
      //push into that array
      const comment = await Comments.findById(req.body.commentID);
      comment.commentIDs.push(newCommentObj._id);
      await comment.save();
    } else {
      //it's a direct comment to a post's commentID
      const post = await Posts.findById(req.body.postID);
      post.commentIDs.push(newCommentObj._id);
      await post.save();
    }

    console.log("end of comments");

    res.status(200).json(newCommentObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/views', async (req, res) => {
  try {
     const post = await Posts.findById(req.body.postID);
     post.views += 1;
     await post.save();
     res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  console.log("login session id: " + req.sessionID)

  try {
      const {email, password} = req.body;
      const user = await User.findOne({email});
  
      if (!user) {
          //ask about handling errors
          console.log("user not found");
          return res.send(false);
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
  
      req.session.userId = user._id;
      res.send(validPassword);
  } catch (error) {
      res.status(500).json("server error");
  }
});

app.post('/signup', async (req, res) => { 
  try {
    //Check if the email or displayname already exists in the database, if it does
    //it's an invalid email/displayname and redirect back to the sign up with error

    /*
    Check if the email or display name already exists in the database, if it does
    it's an invalid email/display name and do not allow creation of new user. 
    This can probably be done using get check or done in the Signup.js?
    */

    /*
    1. No two users can create an account with the same email or display name.  
    2. The typed password should not contain their first or last name, their display name, or their email id. 
    3.Nicely styled feedback must be presented to the user if the account could not be created due to the above reasons or any otherreason.
    */

    const duplicateDisplayName = await User.findOne({displayName: req.body.displayName});
    const duplicateEmail = await User.findOne({email: req.body.email});

    let errors = {};

    if (duplicateDisplayName) {
      errors.displayName = "Duplicate display name";
    }

    if (duplicateEmail) {
      errors.email = "Duplicate email";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    let newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      displayName: req.body.displayName,
      password: req.body.password,
    }

    let newUserObj = new User(newUser);
    await newUserObj.save();

    res.status(200).json(newUserObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/logout', async (req, res) => {
  console.log("logging out: ", req.sessionID);

  req.session.destroy((err) => {
    if (err) {
      console.error("session destroy error ", err);
      return res.status(500).json({ message: "session destroy error " });
    }
    res.status(200).json({ message: "logout success" });
  });
  
});

app.listen(8000, () => {console.log("Server listening on port 8000...");});
