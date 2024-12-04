import './maincontent.css';
import CreatePostPage from '../input/CreatePostPage';
import Homepage from '../pages/Homepage';
import CreateCommunity from '../input/CreateCommunity';
import CommunityPage from '../pages/CommunityPage';
import PostDisplay from '../pages/PostDisplay';
import SearchPage from '../pages/SearchPage';
import CommentForm from '../input/CommentForm';
import Profile from '../input/Profile';
import { useState, useEffect } from 'react';

function MainContent(props) {
  const [postID, setPostID] = useState(null);
  const [communityID, setCommunityID] = useState(null);

  const { type, id } = props.currentView;

  useEffect(() => {
    if (type === 'community' && id) {
      setCommunityID(id);
      setPostID(null);
    } else if (type === 'post' && id) {
      setPostID(id);
      setCommunityID(null);
    }
  }, [type, id]);

  console.log("current view: ", type, "Post ID:", postID, "Community ID:", communityID);

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
      />
    );
  } else if (type === 'create-post') {
    content = (
      <CreatePostPage
        setView={props.setView}
        setCount={props.setCount}
        posts={props.posts}
        setPosts={props.setPosts}
        communities={props.communities}
        linkFlair={props.linkFlair}
      />
    );
  } else if (type === 'create-community') {
    content = (
      <CreateCommunity
        setView={props.setView}
        setCount={props.setCount}
        communities={props.communities}
        setCommunities={props.setCommunities}
      />
    );
  } else if (type === 'create-comment') {
    content = (
      <CommentForm
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
      />
    );
  } else if (type === 'community' && communityID) {
    content = (
      <CommunityPage
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
      />
    );
  }
  else if(type === 'profile') { 
    content = (
      <Profile

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
