import PostInfoCard from "./PostInfoCard";
import DottedLine from "../general/DottedLine";

function PostList(props) {
    return (
        <div className="post-list">
            {props.posts.map((post, index) => (
                <div key={`${post._id}${index}`}>
                    <PostInfoCard post={post} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
                    <DottedLine />
                </div>
            ))}
        </div>
    );
}

export default PostList