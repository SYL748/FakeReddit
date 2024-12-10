import Delimiter from "../general/Delimiter";
import PostCount from '../posts/PostCount';
import ButtonList from '../general/ButtonList'
import './homepage.css'
import PostList from "../posts/PostList";
import axios from "axios";
import { useState, useEffect } from "react";
import { sortNewest } from "../utils/SortingUtil";

//I'm passing down communities into posts, I need to find the posts in each community individually
function Homepage(props) {
    const [userPostList, setUserPostList] = useState([]);
    const [otherPostList, setOtherPostList] = useState([]);

    const findPosts = async (communities) => {
        try {
            console.log("in post");
            const res = await axios.post('http://localhost:8000/find-posts', {communities});
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
            console.log(userPostList);
            const otherPosts = await findPosts(props.otherCommunities);
            setOtherPostList(sortNewest(otherPosts));
        };

        setPosts();
    }, [props.userCommunities, props.otherCommunities]);

    console.log("user: " + userPostList);
    console.log("other: " + otherPostList);
    console.log("all: " + props.posts);
    console.log("LOGGED IN: " + props.loggedIn);

    return (
        <div>
            <div className="home-heading">
                <h2>All Posts</h2>
                <ButtonList posts={props.posts} setPosts={props.setPosts} comments={props.comments}/>
            </div>
            <PostCount currPostCount={props.currPostCount} />
            <Delimiter />

            {props.loggedIn ? (
                <>
                <PostList posts={userPostList} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
                {userPostList.length === 0 || otherPostList.length === 0 ? null : <Delimiter /> }
                <PostList posts={otherPostList} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
                </>
            ) : (
                <PostList posts={props.posts} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
            ) 
            }
        </div>
    );
}

export default Homepage