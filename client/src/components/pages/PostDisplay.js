import PostDetails from "./PostDetails"
import Delimiter from "../general/Delimiter"
import CommentDetail from "./CommentDetail"
export default function PostDisplay(props) {
    const post = props.posts.find(p => p._id === props.postID);
    console.log(post);
    console.log(props.postID);
    return (
        <>
            <PostDetails
                postID={props.postID}
                communities={props.communities}
                setView={props.setView}
                posts={props.posts}
                linkFlair={props.linkFlair}
                setIsReply={props.setIsReply}
                setCommentID={props.setCommentID}
                comments={props.comments}
                loggedIn={props.loggedIn}
            />
            <Delimiter />
            {post.commentIDs && post.commentIDs.length > 0 ? (
                <CommentDetail
                    commentIDs={post.commentIDs}
                    comments={props.comments}
                    indentLevel={0}
                    setView={props.setView}
                    setIsReply={props.setIsReply}
                    setCommentID={props.setCommentID}
                    loggedIn={props.loggedIn}
                />
            ) : (
                <p>No comments yet.</p>
            )}
        </>
    )
}