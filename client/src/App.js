// // ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// // ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import PageBanner from './components/layout/PageBanner';
import NavBar from './components/layout/NavBar';
import MainContent from './components/layout/MainContent';
import { useEffect, useState } from 'react';
import { sortNewest } from './components/utils/SortingUtil';
import axios from 'axios';
import Login from './components/input/Login'
import SignupPage from './components/input/SignUp';

function App() {
  const [currentView, setView] = useState({ type: "login", id: null });
  const [loggedIn, setLoggedIn] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [currPostCount, setCount] = useState(0);
  const [linkFlair, setLinkFlair] = useState([]);
  const [query, setQuery] = useState('');
  const [isReply, setIsReply] = useState(false);
  const [commentID, setCommentID] = useState('');

  const fetchCommunities = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('http://localhost:8000/communities');
      setCommunities(response.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('http://localhost:8000/posts');
      setPosts(sortNewest(response.data));
      setCount(response.data.length);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchComments = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('http://localhost:8000/comments');
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchLinkFlairs = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('http://localhost:8000/linkflairs');
      setLinkFlair(response.data);
    } catch (error) {
      console.error("Error fetching link flairs:", error);
    }
  };
  useEffect(() => {
    console.log('Updated currentView:', currentView); // Debug
  }, [currentView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // if (currentView.type === 'community' && currentView.id) {
        //   console.log(`Fetching community with ID: ${currentView.id}`);
        //   await fetchCommunityById(currentView.id);
        // } else if (currentView.type === 'post' && currentView.id) {
        //   console.log(`Fetching post with ID: ${currentView.id}`);
        //   await fetchPostById(currentView.id);
        // } else if (currentView.type === 'home') {
        console.log('Fetching home data...');
        await fetchCommunities();
        console.log('Fetching communities...');
        await fetchPosts();
        console.log('Fetching posts...');
        await fetchComments();
        console.log('Fetching comments...');
        await fetchLinkFlairs();
        console.log('Fetching link flairs...');
        // } else {
        //   console.error('Unknown view type:', currentView.type);
        // }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, [currentView]);

const handleLogin = () => {
  setLoggedIn(true);
  setView({type: 'home', id: null});
};

const handleGuestMode = () => {
  setLoggedIn(false);
  setView({type: 'home', id: null});
};

const handleSignup = () => {
  setView({type: 'signup', id: null});
};

const handleSignupComplete = () => {
  setView({type: 'login', id: null});
};

  return (
    <div className="top">
        {currentView.type === "login" && (
            <Login
                onLogin={handleLogin}
                onSignup={handleSignup}
                onGuest={handleGuestMode}
                setView={setView}
                setLoggedIn={setLoggedIn}
            />
        )}
        {currentView.type === "signup" && (
            <SignupPage onSignupComplete={handleSignupComplete} />
        )}
        {currentView.type === 'home' && (
          <>
                <PageBanner
                    setView={setView}
                    posts={posts}
                    setPosts={setPosts}
                    currentView={currentView}
                    comments={comments}
                    setSearchResults={setSearchResults}
                    setQuery={setQuery}
                    query={query}
                    isLoggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                />
                <NavBar
                    setView={setView}
                    communities={communities}
                    currentView={currentView}
                    setPosts={setPosts}
                    posts={posts}
                />
                <MainContent
                    currentView={currentView}
                    setView={setView}
                    communities={communities}
                    setCommunities={setCommunities}
                    posts={posts}
                    setPosts={setPosts}
                    comments={comments}
                    setComments={setComments}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    currPostCount={currPostCount}
                    setCount={setCount}
                    linkFlair={linkFlair}
                    setLinkFlair={setLinkFlair}
                    query={query}
                    isReply={isReply}
                    setIsReply={setIsReply}
                    commentID={commentID}
                    setCommentID={setCommentID}
                />
            </>
        )}

    </div>
);
}

export default App;