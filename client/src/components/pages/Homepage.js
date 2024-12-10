import Delimiter from "../general/Delimiter";
import PostCount from '../posts/PostCount';
import ButtonList from '../general/ButtonList'
import './homepage.css'
import PostList from "../posts/PostList";

//I'm passing down communities into posts, I need to find the posts in each community individually
function Homepage(props) {
    console.log(props.posts);
    console.log(props.userCommunities);
    console.log(props.otherCommunities);


    return (
        <div>
            <div className="home-heading">
                <h2>All Posts</h2>
                <ButtonList posts={props.posts} setPosts={props.setPosts} comments={props.comments}/>
            </div>
            <PostCount currPostCount={props.currPostCount} />
            <Delimiter />

            {props.isLoggedIn ? (
                <>
                <PostList posts={props.userCommunities} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
                <Delimiter />
                <PostList posts={props.otherCommunities} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
                </>
            ) : (
                <PostList posts={props.posts} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
            ) 
            }
        </div>
    );
}

export default Homepage