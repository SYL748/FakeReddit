// // ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// // ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import PageBanner from './components/layout/PageBanner';
import NavBar from './components/layout/NavBar';
import MainContent from './components/layout/MainContent';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './components/input/Login'
import SignupPage from './components/input/SignUp';

function App() {
  const [currentView, setView] = useState({ type: "login", id: null });
  const [loggedIn, setLoggedIn] = useState(false);
  const [guest, setGuest] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [currPostCount, setCount] = useState(0);
  const [linkFlair, setLinkFlair] = useState([]);
  const [query, setQuery] = useState('');
  const [isReply, setIsReply] = useState(false);
  const [commentID, setCommentID] = useState('');
  const [user, setUser] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);
  const [otherCommunities, setOtherCommunities] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [otherComments, setOtherComments] = useState([]);
  const [create, setCreate] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/current-user', {
        withCredentials: true,
      });
      // console.log("Current user fetched successfully:", response.data);
      setUser(response.data);
      handleLogin();
    } catch (error) {
      handleSignupComplete();
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/current-user', {
        withCredentials: true,
      });
      // console.log("Current user fetched successfully:", response.data);
      setUser(response.data);
    } catch (error) {
      console.log("Logged out.");
    }
  };

  // const fetchCommunities = async () => {
  //   try {
  //     axios.defaults.withCredentials = true;
  //     const response = await axios.get('http://localhost:8000/communities');
  //     setCommunities(response.data);
  //   } catch (error) {
  //     console.error("Error fetching communities:", error);
  //   }
  // };

  const fetchCommunities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/communities', {
        withCredentials: true,
      });
      const allCommunities = response.data;
      setCommunities(allCommunities);
      // Separate communities into "created by user" and "not created by user"
      if (user) {
        const userCreated = allCommunities.filter((community) =>
          user.communityIDs.includes(community._id)
        );
        // userCreated.map(community => console.log(community.name));
        const others = allCommunities.filter(
          (community) => !user.communityIDs.includes(community._id)
        );
        setUserCommunities(userCreated);
        setOtherCommunities(others);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  // const fetchPosts = async () => {
  //   try {
  //     axios.defaults.withCredentials = true;
  //     const response = await axios.get('http://localhost:8000/posts');
  //     setPosts(sortNewest(response.data));
  //     setCount(response.data.length);
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //   }
  // };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/posts', {
        withCredentials: true,
      });
      setPosts(response.data);
      if (user) {
        const userPosts = posts.filter((post) => user.postIDs.includes(post._id));
        const otherPosts = posts.filter((post) => !user.postIDs.includes(post._id));
  
        setUserPosts(userPosts);
        setOtherPosts(otherPosts);
      }
      setCount(response.data.length); // Total post count
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  
  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/comments', {
        withCredentials: true,
      });
      setComments(response.data);
      if (user) {
        const userComments = comments.filter((comment) => user.commentIDs.includes(comment._id));
        const otherComments = comments.filter((comment) => !user.commentIDs.includes(comment._id));
  
        setUserComments(userComments);
        setOtherComments(otherComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  // const fetchComments = async () => {
  //   try {
  //     axios.defaults.withCredentials = true;
  //     const response = await axios.get('http://localhost:8000/comments');
  //     setComments(response.data);
  //   } catch (error) {
  //     console.error("Error fetching comments:", error);
  //   }
  // };

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
    const checkLoginStatus = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error('error login status', error.message);
      }
    };
    checkLoginStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (create) {
          setCreate(false);
          await fetchCommunities();
          await fetchPosts();
          await fetchComments();
          await fetchLinkFlairs();
          return;
        }
        if (loggedIn || guest) {
          console.log("RENREDINERINGDSFJGNS")
          await fetchCommunities();
          await fetchPosts();
          await fetchComments();
          await fetchLinkFlairs();
          if(loggedIn){await fetchUser();}
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, isMember]);

  const handleLogin = () => {
    setLoggedIn(true);
    setView({ type: 'home', id: null });
  };

  const handleGuestMode = () => {
    setLoggedIn(false);
    setGuest(true);
    setView({ type: 'home', id: null });
  };

  const handleSignup = () => {
    setView({ type: 'signup', id: null });
  };

  const handleSignupComplete = () => {
    setView({ type: 'login', id: null });
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
          setGuest = {setGuest}
          setUser={setUser}
        />
      )}
      {currentView.type === "signup" && (
        <SignupPage onSignupComplete={handleSignupComplete} />
      )}
      {currentView.type !== 'signup' && currentView.type !== 'login' && (
        <>
          <PageBanner
            user={user}
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
            user={user}
            guest={guest}
            setView={setView}
            communities={communities}
            currentView={currentView}
            userCommunities={userCommunities}
            otherCommunities={otherCommunities}
            setPosts={setPosts}
            posts={posts}
            isLoggedIn={loggedIn}
          />
          <MainContent
            loggedIn={loggedIn}
            userPosts={userPosts}
            otherPosts={otherPosts}
            userCommunities={userCommunities}
            setUserCommunities={setUserCommunities}
            setCreate={setCreate}
            otherCommunities={otherCommunities}
            user={user}
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
            userComments={userComments}
            otherComments={otherComments}
            setIsMember={setIsMember}
            isMember={isMember}
          />
        </>
      )}

    </div>
  );
}

export default App;