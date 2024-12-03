// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/phreddit";
mongoose.connect(mongoDB)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('MongoDB connection error:', err));

const Community = require('./models/communities.js');
const Comments = require('./models/comments.js');
const LinkFlairs = require('./models/linkflairs.js');
const Posts = require('./models/posts.js');

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
    console.log("is it coming here");

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

app.listen(8000, () => {console.log("Server listening on port 8000...");});
