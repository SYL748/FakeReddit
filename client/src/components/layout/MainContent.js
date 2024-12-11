import './maincontent.css';
import CreatePostPage from '../input/CreatePostPage';
import Homepage from '../pages/Homepage';
import CreateCommunity from '../input/CreateCommunity';
import CommunityPage from '../pages/CommunityPage';
import PostDisplay from '../pages/PostDisplay';
import SearchPage from '../pages/SearchPage';
import CommentForm from '../input/CommentForm';
import Profile from '../input/Profile';
import EditCommunity from '../input/editCommunity';
import { useState, useEffect } from 'react';
import EditPosts from '../input/editPost';
import EditComment from '../input/editComment';

function MainContent(props) {
  const [postID, setPostID] = useState(null);
  const [communityID, setCommunityID] = useState(null);
  const { type, id } = props.currentView;

  useEffect(() => {
    if (type === 'home') {
      setPostID(null);
      setCommunityID(null);
      props.setCommentID(null);
    } else if ((type === 'community' || type === 'edit-community') && id) {
      setCommunityID(id);
      setPostID(null);
      props.setCommentID(null);
    } else if ((type === 'post' || type === 'edit-post') && id) {
      setPostID(id);
      setCommunityID(null);
      props.setCommentID(null);
    } else if (type === 'edit-comment' && id) {
      props.setCommentID(id);
      setCommunityID(null);
      setPostID(null);
    }
  }, [type, id]);

  console.log("current view: ", type, "Post ID:", postID, "Community ID:", communityID, "Comment ID:", props.commentID);

  let content;

  if (type === 'home') {
    content = (
      <Homepage
        currPostCount={props.currPostCount}
        posts={props.posts}
        setPosts={props.setPosts}
        setView={props.setView}
        comments={props.comments}
        communities={props.communities}
        linkFlair={props.linkFlair}
        currentView={props.currentView}
        userCommunities={props.userCommunities}
        otherCommunities={props.otherCommunities}
        loggedIn={props.loggedIn}
      />
    );
  } else if (type === 'create-post') {
    content = (
      <CreatePostPage
        userCommunities={props.userCommunities}
        otherCommunities={props.otherCommunities}
        user={props.user}
        setView={props.setView}
        setCount={props.setCount}
        posts={props.posts}
        setPosts={props.setPosts}
        communities={props.communities}
        linkFlair={props.linkFlair}
      />
    );
  } else if (type === 'edit-post' && postID) {
    content = (
      <EditPosts
        communityID={communityID}
        postID={postID}
        posts={props.posts}
        setPosts={props.setPosts}
        communities={props.communities}
        comments={props.comments}
        setView={props.setView}
        linkFlair={props.linkFlair}
        setCommunities={props.setCommunities}
        currentView={props.currentView}
      />
    )
  } else if (type === 'create-community') {
    content = (
      <CreateCommunity
        user={props.user}
        setView={props.setView}
        setCount={props.setCount}
        communities={props.communities}
        setCommunities={props.setCommunities}
        setUserCommunities={props.setUserCommunities}
        setCreate={props.setCreate}
      />
    );
  } else if (type === "edit-community" && communityID) {
    content = (
      <EditCommunity
        communityID={communityID}
        posts={props.posts}
        setPosts={props.setPosts}
        communities={props.communities}
        comments={props.comments}
        setView={props.setView}
        linkFlair={props.linkFlair}
        setCommunities={props.setCommunities}
        currentView={props.currentView}
      />
    );
  } else if (type === "edit-comment" && props.commentID) {
    content = (
      <EditComment
        communityID={props.communityID}
        posts={props.posts}
        setPosts={props.setPosts}
        communities={props.communities}
        comments={props.comments}
        setView={props.setView}
        linkFlair={props.linkFlair}
        setCommunities={props.setCommunities}
        currentView={props.currentView}
        commentID={props.commentID}
      />)
  } else if (type === 'create-comment') {
    content = (
      <CommentForm
        user={props.user}
        postID={postID}
        comments={props.comments}
        setComments={props.setComments}
        posts={props.posts}
        setView={props.setView}
        isReply={props.isReply}
        commentID={props.commentID}
        communities={props.communities}
      />
    );
  } else if (type === 'search-view') {
    content = (
      <SearchPage
        posts={props.searchResults}
        setPosts={props.setSearchResults}
        query={props.query}
        currPostCount={props.currPostCount}
        setView={props.setView}
        comments={props.comments}
        communities={props.communities}
        linkFlair={props.linkFlair}
        currentView={props.currentView}
        userCommunities={props.userCommunities}
        otherCommunities={props.otherCommunities}
        loggedIn={props.loggedIn}
      />
    );
  } else if (type === 'community' && communityID) {
    content = (
      <CommunityPage
        user={props.user}
        loggedIn={props.loggedIn}
        communityID={communityID}
        posts={props.posts}
        setPosts={props.setPosts}
        communities={props.communities}
        comments={props.comments}
        setView={props.setView}
        linkFlair={props.linkFlair}
        setCommunities={props.setCommunities}
        currentView={props.currentView}
      />
    );
  } else if (type === 'post' && postID) {
    content = (
      <PostDisplay
        postID={postID}
        communities={props.communities}
        setView={props.setView}
        posts={props.posts}
        linkFlair={props.linkFlair}
        comments={props.comments}
        setIsReply={props.setIsReply}
        setCommentID={props.setCommentID}
        loggedIn={props.loggedIn}
      />
    );
  }
  else if (type === 'profile') {
    content = (
      <Profile
        user={props.user}
        communities={props.communities}
        setView={props.setView}
        userCommunities={props.userCommunities}
        userPosts={props.userPosts}
        userComments={props.userComments}
      />
    );
  } else {
    content = (
      <div>
        <h1>ERROR: Unknown View</h1>
      </div>
    );
  }

  return <div className="main-content">{content}</div>;
}

export default MainContent;
