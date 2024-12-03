import { formatTimestamp } from '../utils/FormatTimeUtil';
import { findCommunityByPostID } from '../utils/FindCommunityByPostID.js';
import { getTotalCommentCount } from '../utils/GetTotalCommentCount.js';

function PostDetails(props) {
    const communityName = findCommunityByPostID(props.postID, props.communities);
    const post = props.posts.find(p => p._id === props.postID);
    const linkFlair = props.linkFlair.find(f => f._id === post.linkFlairID)?.content || '';
    return (
        <div className="post-page">
            <div className="post-details">
                <div className="post-details-heading">
                    <p>
                        <span className="bold">In Community: </span>{communityName} posted {formatTimestamp(new Date(post.postedDate))}
                    </p>
                    <p><span className="bold">Posted by: </span>{post.postedBy}</p>
                    <h4><span className="bold">Post Title: </span>{post.title}</h4>
                    {linkFlair ? <p><span className="bold">Link Flair: </span>{linkFlair}</p> : ''}
                </div>
                <div className="post-details-content">
                    <p style={{wordBreak:"break-all"}}><span className="bold">Content:</span> {post.content}</p>
                </div>
                <div className="post-details-footer">
                    <div className="views-comments">
                        <p><span className="bold">Views: </span>{post.views}</p>
                        <p><span className="bold">Comments: </span>{getTotalCommentCount(props.comments, post.commentIDs)}</p>
                    </div>
                    <button onClick={() => {
                        props.setView({type: 'create-comment', id: null});
                        props.setIsReply(false);
                        props.setCommentID('');
                        }}>Comment</button>
                </div>
            </div>
        </div>
    );
}
export default PostDetails