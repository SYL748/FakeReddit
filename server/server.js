// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const UserModel = require('./models/users');
const bcrypt = require('bcrypt');
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,              // Allow cookies to be sent
}));
app.use(express.json());

const mongoose = require('mongoose');
if (process.env.NODE_ENV !== "test") {
  const mongoDB = "mongodb://127.0.0.1:27017/phreddit";
  mongoose
    .connect(mongoDB)
    .then(() => console.log("Connected to database"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

app.use(session({
  secret: "temp",
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000, secure: false },
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/phreddit' }),
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
const Post = require('./models/posts.js');


const validateSession = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      req.user = null; // Allow the request to continue without user data
      return next(); // Continue to the next middleware or route handler
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.user = null;
      return next();
    }
    req.user = user; // Attach user data to the request
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

app.get('/current-user', validateSession, (req, res) => {
  if (!req.user) {
    // Gracefully handle the not-logged-in case
    return res.status(400).json({ loggedIn: false});
  }
  const { _id, displayName, email, isAdmin, reputation, communityIDs, postIDs, commentIDs } = req.user;
  res.status(200).json({
    loggedIn: true,
    id: _id,
    displayName,
    email,
    isAdmin,
    reputation,
    communityIDs,
    postIDs,
    commentIDs
  });
});

app.get('/communities', async (req, res) => {
  try {
    const communities = await Community.find();
    //console.log("COMMUNITIES" + communities);
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

app.post('/find-posts', async (req, res) => {
  try {
    const allPosts = [];

    for (const community of req.body.communities) {
      const foundCommunity = await Community.findById(community._id);
      console.log("Checking community: " + foundCommunity);

      if (foundCommunity) {
        for (const postId of foundCommunity.postIDs) {
          console.log(postId);
          const post = await Posts.findById(postId);
          console.log("POST IS FOUND?");
          console.log(post);
          if (post) {
            console.log("PUSHING POST");
            console.log(post);
            allPosts.push(post);
          }
        }
      }
    }

    //console.log("SENDING THESE POSTS: ");
    console.log(allPosts);

    res.status(200).json(allPosts);
  } catch (error) {
      res.status(500).json({ message: 'server' });
  }
});




app.post('/find-posts-debug', async (req, res) => {
  try {
    //console.log(req.body);
    const allPosts = [];

    for (const community of req.body.communities) {
      const foundCommunity = await Community.findById(community._id);
      //console.log("Checking community DEBUG: " + foundCommunity);

      if (foundCommunity) {
        for (const postId of foundCommunity.postIDs) {
          const post = await Posts.findById(postId);
          if (post) {
            //console.log("PUSHING POST DEBUG");
            //console.log(post);
            allPosts.push(post);
          }
        }
      }
    }

    //console.log("SENDING THESE POSTS DEBUG: ");
    //console.log(allPosts);

    res.status(200).json(allPosts);
  } catch (error) {
      res.status(500).json({ message: 'server' });
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
      //console.log(req.body.linkFlairID);
      let linkFlairObj = await LinkFlairs.findOne({ content: req.body.linkFlairID });

      if (!linkFlairObj) {
        linkFlairObj = new LinkFlairs({ content: req.body.linkFlairID });
        //console.log(linkFlairObj);
        await linkFlairObj.save();
      }

      postObject = {
        title: req.body.title,
        content: req.body.content,
        linkFlairID: linkFlairObj,
        postedBy: req.body.postedBy,
      }
    }
    const communities = await Community.findOne({ name: req.body.communityName });
    //console.log("community backend" + communities);

    let post = new Posts(postObject);
    //console.log(post);
    await post.save();
    await UserModel.findByIdAndUpdate(
      req.session.userId,
      { $push: { postIDs: { $each: [post._id] } } },
      { new: true }
    );
    communities.postIDs.push(post._id);
    await communities.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/create-community', async (req, res) => {
  try {

    let communityObj = {
      name: req.body.name,
      description: req.body.description,
      members: [req.body.members],
      creator: req.body.creator
    }

    let newCommunityObj = new Community(communityObj);
    await newCommunityObj.save();
    await UserModel.findByIdAndUpdate(
      req.session.userId,
      { $push: { communityIDs: { $each: [newCommunityObj._id] } } },
      { new: true }
    );
    res.status(200).json(newCommunityObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.patch('/edit-post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, title } = req.body;
    //console.log("BEFORE");
    console.log("EDITED TITEL" + title);

    // Validate the input
    if (!content) {
      return res.status(400).json({ message: "Description is required." });
    }
    // Find and update the community
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content, title },
      { new: true } // Return the updated document
    )
    //console.log("dsafsdafas"+updatedPost);
    //console.log("AFTER");
    if (!updatedPost) {
      return res.status(404).json({ message: "Community not found." });
    }

    res.status(200).json({ message: "Post updated successfully!", updatedPost });
  } catch (error) {
    console.error("Error updating community:", error);
    res.status(500).json({ message: "Server error while updating community." });
  }
});
app.patch('/edit-comment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validate the input
    if (!content) {
      return res.status(400).json({ message: "Description is required." });
    }

    // Find and update the community
    const updatedComment = await Comments.findByIdAndUpdate(
      id,
      { content },
      { new: true } // Return the updated document
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Community not found." });
    }

    res.status(200).json({ message: "Community updated successfully!", updatedComment });
  } catch (error) {
    console.error("Error updating community:", error);
    res.status(500).json({ message: "Server error while updating community." });
  }
});
app.patch('/edit-community/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, communityName } = req.body;

    // Validate the input
    if (!description) {
      return res.status(400).json({ message: "Description is required." });
    }

    // Find and update the community
    const updatedCommunity = await Community.findByIdAndUpdate(
      id,
      { description, name: communityName },
      { new: true } // Return the updated document
    );

    if (!updatedCommunity) {
      return res.status(404).json({ message: "Community not found." });
    }

    res.status(200).json({ message: "Community updated successfully!", updatedCommunity });
  } catch (error) {
    console.error("Error updating community:", error);
    res.status(500).json({ message: "Server error while updating community." });
  }
});

app.get('/communities/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    //console.log("req id " + req.params.id);
    await community.save();
    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/communities/:id/join', async (req, res) => {
  try{
    let user = await User.findById(req.session.userId);
    console.log("JON COMMUNITY:" + user);
    await UserModel.findByIdAndUpdate(
      req.session.userId,
      { $push: { communityIDs: req.params.id } }, // Remove communityId from communityIDs array
      { new: true } // Return the updated user document
    );
    await Community.findByIdAndUpdate(
      req.params.id,
      {
        $push: { members: user.displayName}, // Remove the username from the members array
        $inc: { memberCount: +1 } // Decrement the member count by 1
      },
      { new: true } // Return the updated document
    );
    res.status(200).json( {mesage: "working"});
  } catch (error){
    res.status(500).json({ message: error.message });
  }
})

app.post('/communities/:id/leave', async (req, res) => {
  try{
    let user = await User.findById(req.session.userId);
    await UserModel.findByIdAndUpdate(
      req.session.userId,
      { $pull: { communityIDs: req.params.id } }, // Remove communityId from communityIDs array
      { new: true } // Return the updated user document
    );
    await Community.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { members: user.displayName}, // Remove the username from the members array
        $inc: { memberCount: -1 } // Decrement the member count by 1
      },
      { new: true } // Return the updated document
    );
    res.status(200).json( {mesage: "working"});
  } catch (error){
    res.status(500).json({ message: error.message });
  }
})


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
    //console.log("end of comments");
    await UserModel.findByIdAndUpdate(
      req.session.userId,
      { $push: { commentIDs: { $each: [newCommentObj._id] } } },
      { new: true }
    );
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

app.post('/upvotes', async (req, res) => {
  try {
    const post = await Posts.findById(req.body.postID);
    return res.status(200).json({upvotes: post.upvotes});

  } catch (error) {
    res.status(400).json({ message: error.message });
  } 
});

app.post('/comment-upvotes', async (req, res) => {
  try {
    const comment = await Comments.findById(req.body.commentID);

    return res.status(200).json({ upvotes: comment.upvotes });
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch('/increment-upvote', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.userId);
    const post = await Posts.findById(req.body.postID);

    if (currentUser.reputation < 50) {
      return res.status(400).json({ message: "not enough reputation (min 50)" });
    }

    await Posts.findByIdAndUpdate(
      req.body.postID,
      {$inc: {upvotes: 1}},
      {new: true},
    );

    await User.findOneAndUpdate(
      {displayName: post.postedBy},
      {$inc: {reputation: 5}},
      {new: true},
    )
    
  res.status(200).json({ message: "incremented"});

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch('/decrement-upvote', async (req, res) => {
  //console.log(req.body.postID);
  try {
    const currentUser = await User.findById(req.session.userId);
    const post = await Posts.findById(req.body.postID);

    if (currentUser.reputation < 50) {
      return res.status(400).json({ message: "not enough reputation (min 50)" });
    }

    await Posts.findByIdAndUpdate(
      req.body.postID,
      {$inc: {upvotes: -1}},
      {new: true},
    );

    await User.findOneAndUpdate(
      {displayName: post.postedBy},
      {$inc: {reputation: -10}},
      {new: true},
    )
    
  res.status(200).json({ message: "incremented"});

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch('/increment-comment-upvote', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.userId);
    const comment = await Comments.findById(req.body.commentID);

    if (currentUser.reputation < 50) {
      return res.status(400).json({ message: "not enough reputation (min 50)" });
    }

    await Comments.findByIdAndUpdate(
      req.body.commentID,
      {$inc: {upvotes: 1}},
      {new: true}
    );

    await User.findOneAndUpdate(
      {displayName: comment.commentedBy},
      {$inc: {reputation: 5}},
      {new: true}
    )

    res.status(200).json({ message: "Comment upvoted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/decrement-comment-upvote', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.userId);
    const comment = await Comments.findById(req.body.commentID);

    if (currentUser.reputation < 50) {
      return res.status(400).json({ message: "not enough reputation (min 50)" });
    }

    await Comments.findByIdAndUpdate(
      req.body.commentID,
      {$inc: {upvotes: -1}},
      {new: true}
    );

    await User.findOneAndUpdate(
      {displayName: comment.commentedBy},
      {$inc: {reputation: -10}},
      {new: true}
    )

    res.status(200).json({ message: "Comment downvoted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  //console.log("login session id: " + req.sessionID)

  try {
    const email = await User.findOne({ email: req.body.email });
    let errors = {};

    if (!email) {
      errors.email = "Email does not exist.";
      return res.status(400).json({ errors });
    }

    const validPassword = await bcrypt.compare(req.body.password, email.password);

    if (!validPassword) {
      errors.validPassword = "Wrong password."
      return res.status(400).json({ errors });
    }

    req.session.userId = email._id;
    res.send(validPassword);
  } catch (error) {
    res.status(500).json("server error");
  }
});

app.post('/signup', async (req, res) => {
  try {
    const duplicateDisplayName = await User.findOne({ displayName: req.body.displayName });
    const duplicateEmail = await User.findOne({ email: req.body.email });

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
  //console.log("logging out: ", req.sessionID);

  req.session.destroy((err) => {
    if (err) {
      console.error("session destroy error ", err);
      return res.status(500).json({ message: "session destroy error " });
    }
    res.status(200).json({ message: "logout success" });
  });

});

app.get('/user-creation-date/:id', async (req, res) => {
  try {
    console.log("REQ PARAMS" + req.params.id);
    const user = await User.findById(req.params.id);

    console.log(user);
    console.log(user.creationDate);
    console.log(user.creationDate.toDateString());

    res.send(user.creationDate.toDateString());
  } catch (e) {
    res.status(400).json({message: "error in creation date"});
  }
});

app.get('/user-communities/:id', async (req, res) => {
  try {
    console.log("REQ PARAMS" + req.params.id);
    const user = await User.findById(req.params.id);
    //const user = await User.findById(req.session.userId);
    console.log("User: " + user);
    const userCommunities = await Community.find({creator: user.displayName});
    console.log("User Communities: "+ userCommunities);

    res.status(200).json({communities: userCommunities});
  } catch (e) {
    res.status(400).json({message: "error in creation date"});
  }
})

app.delete('/delete-community/:id', async (req, res) => {
  console.log("IN DELETE");
  console.log("DELETING", req.params.id);

  try {
    const community = await Community.findById(req.params.id);

    const posts = await Posts.find({ _id: { $in: community.postIDs } });

    for (const post of posts) {
      console.log("DELETING POST:", post._id);

      for (const commentId of post.commentIDs) {
        await deleteCommentAndReplies(commentId);
      }

      await Posts.findByIdAndDelete(post._id);
    }

    await Community.findByIdAndDelete(req.params.id);

    res.status(200).json({message: "deleted successfully"});
  } catch (error) {
    res.status(500).json({message: "delete error"});
  }
});

const deleteCommentAndReplies = async (commentId) => {
  try {
    const comment = await Comments.findById(commentId);
    if (!comment) return;

    console.log("DELETING COMMENT:", comment._id);

    for (const replies of comment.commentIDs) {
      await deleteCommentAndReplies(replies);
    }

    //parent
    await Comments.findByIdAndDelete(comment._id);
  } catch (error) {
    console.error("error deleting comments", error);
  }
};

app.get('/user-posts/:id', async (req, res) => {
  try {
    console.log("REQ PARAMS" + req.params.id);
    const user = await User.findById(req.params.id);
    //const user = await User.findById(req.session.userId);
    const userPosts = await Posts.find({postedBy: user.displayName});

    res.status(200).json({posts: userPosts});
  } catch (e) {
    res.status(400).json({message: "error in user posts"});
  }
})

app.get('/user-comments/:id', async (req, res) => {
  try {
    console.log("REQ PARAMS" + req.params.id);
    const user = await User.findById(req.params.id);
    //const user = await User.findById(req.session.userId);
    const userComments = await Comments.find({commentedBy: user.displayName});

    res.status(200).json({comments: userComments});
  } catch (e) {
    res.status(400).json({message: "error in user comments"});
  }
})

app.post('/get-users', async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({users: users});
  } catch (error) {
    res.status(400).json({message: "error in userdate"});
  }
})

app.delete('/delete-post/:id', async (req, res) => {
  console.log("IN DELETE");
  console.log("DELETING", req.params.id);

  try {
    const posts = await Posts.findById(req.params.id);

    for (const commentId of posts.commentIDs) {
      await deleteCommentAndReplies(commentId);
    }

    await Posts.findByIdAndDelete(req.params.id);

    await Community.findOneAndUpdate(
      {postIDs: req.params.id},
      {$pull: {postIDs: req.params.id}},
      {new: true}
    );

    res.status(200).json({message: "deleted successfully"});
  } catch (error) {
    res.status(500).json({message: "delete error"});
  }
});

app.delete('/delete-comment/:id', async (req, res) => {
  console.log("IN DELETE");
  console.log("DELETING", req.params.id);

  try {
    await Posts.findOneAndUpdate(
      {commentIDs: req.params.id},
      {$pull: {commentIDs: req.params.id}},
      {new: true}
    );

    await deleteCommentAndReplies(req.params.id);

    res.status(200).json({message: "deleted successfully"});
  } catch (error) {
    res.status(500).json({message: "delete error"});
  }
});

app.post('/check-admin', async (req, res) => {
  console.log("CHECKING ADMIN");
  try {
    const user = await User.findById(req.session.userId);

    console.log("IS ADMIN? " + user.isAdmin);
    res.status(200).json({isAdmin: user.isAdmin});

  } catch (error) {
    res.status(500).json({message: "check admin error"});
  }
});

app.delete('/delete-user/:id', async (req, res) => {
  try {
    console.log("DELETE REQ" + req.params.id);
    const user = await User.findById(req.params.id);

    for (const postID of user.postIDs) {
      const post = await Posts.findById(postID);

      console.log("DELETING POST" + post);

      if (post) {
        await Community.findOneAndUpdate(
          {postIDs: postID},
          {$pull: {postIDs: postID}},
          {new: true}
        );

        for (const commentID of post.commentIDs) {
          await deleteCommentAndReplies(commentID);
        }
        await Posts.findByIdAndDelete(postID);
      }
    }

    for (const communityID of user.communityIDs) {
      const community = await Community.findById(communityID);
      if (community) {
        community.members = community.members.filter(member => member !== user.displayName);
        community.memberCount = community.members.length;

        if (community.creator === user.displayName) {

          const communityPosts = await Posts.find({ _id: { $in: community.postIDs } });

          for (const communityPost of communityPosts) {          
            for (const commentId of communityPost.commentIDs) {
              await deleteCommentAndReplies(commentId);
            }
            await Posts.findByIdAndDelete(communityPost._id);
          }

          await Community.findByIdAndDelete(communityID);

        } else {
          await community.save();
        }
      }
    }

    for (const commentID of user.commentIDs) {
      await deleteCommentAndReplies(commentID); 
    }

    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({message: "delete user success"});
  } catch (error) {
    res.status(500).json({message: "delete user error"});
  }
});

app.listen(8000, () => { console.log("Server listening on port 8000..."); });
