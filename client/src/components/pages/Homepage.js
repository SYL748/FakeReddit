import Delimiter from "../general/Delimiter";
import PostCount from '../posts/PostCount';
import ButtonList from '../general/ButtonList'
import './homepage.css'
import PostList from "../posts/PostList";

function Homepage(props) {
    console.log(props.posts);
    return (
        <div>
            <div className="home-heading">
                <h2>All Posts</h2>
                <ButtonList posts={props.posts} setPosts={props.setPosts} comments={props.comments}/>
            </div>
            <PostCount currPostCount={props.currPostCount} />
            <Delimiter />
            <PostList posts={props.posts} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
        </div>
    );
}

export default Homepage