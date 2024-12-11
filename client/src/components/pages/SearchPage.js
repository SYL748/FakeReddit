import ButtonList from "../general/ButtonList";
import './searchpage.css'
import PostCount from "../posts/PostCount";
import Delimiter from "../general/Delimiter";
import PostList from "../posts/PostList";
import axios from "axios";
import { useState, useEffect } from "react";
import { sortNewest } from "../utils/SortingUtil";

function SearchPage(props) {
    let resultsFound = true;

    if (props.posts.length === 0) {
        resultsFound = false;
    }

    const [userPostList, setUserPostList] = useState([]);
    const [otherPostList, setOtherPostList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [filteredOtherList, setFilteredOtherList] = useState([]);


    const findPosts = async (communities) => {
        try {
            const res = await axios.post('http://localhost:8000/find-posts-debug', {communities});
            console.log("res data: ", res.data);
            return res.data;
        } catch (error) {
            console.error('error fetching posts', error);
            return [];
        }
    };

    useEffect(() => {
      const setPosts = async () => {
          const userPosts = await findPosts(props.userCommunities);
          setUserPostList(sortNewest(userPosts));
          const otherPosts = await findPosts(props.otherCommunities);
          setOtherPostList(sortNewest(otherPosts));
      };

      setPosts();
  }, [props.userCommunities, props.otherCommunities]);

    useEffect(() => {
      let matchUser = [];
      let matchOther = [];

      if (userPostList.length > 0) {
          matchUser = props.posts.filter((post) =>
              userPostList.some((userPost) => userPost._id === post._id)
          );
      }

      setFilteredUserList(matchUser);

      if (otherPostList.length > 0) {
          matchOther = props.posts.filter((post) =>
              otherPostList.some((otherPost) => otherPost._id === post._id)
          );
      }

      setFilteredOtherList(matchOther);
  }, [userPostList, otherPostList, props.posts]);

    return (
        <div>
            <div className="search-heading">
                <h2>Search results for: "{props.query}"</h2>
                <ButtonList
                posts={props.posts} 
                setPosts={props.setPosts} 
                comments={props.comments}
                userPosts={filteredUserList}
                setUserPostList={setFilteredUserList}
                otherPosts={filteredOtherList}
                setOtherPostList={setFilteredOtherList}
                loggedIn={props.loggedIn}
                />
            </div>
            <PostCount currPostCount={props.posts.length} />
            <Delimiter />

            <>
              {props.loggedIn ? (
                <>
                  {resultsFound ? (
                    <>
                    <PostList
                      posts={filteredUserList} 
                      setView={props.setView}
                      comments={props.comments}
                      communities={props.communities}
                      linkFlair={props.linkFlair}
                      currentView={props.currentView}/>
                    {filteredUserList.length === 0 || filteredOtherList.length === 0 ? null : <Delimiter /> }
                    <PostList
                      posts={filteredOtherList} 
                      setView={props.setView}
                      comments={props.comments}
                      communities={props.communities}
                      linkFlair={props.linkFlair}
                      currentView={props.currentView}/>
                    </>
                  ) : (
                    <p>No results found for your search.</p>
                  )}
                </>
              ) : (
                <>
                  {resultsFound ? (
                    <PostList
                      posts={props.posts}
                      setView={props.setView}
                      comments={props.comments}
                      communities={props.communities}
                      linkFlair={props.linkFlair}
                      currentView={props.currentView}
                    />
                  ) : (
                    <p>No results found for your search.</p>
                  )}
                </>
              )}
            </>
            
        </div>  
    );
}

export default SearchPage