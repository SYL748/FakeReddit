import { formatTimestamp } from '../utils/FormatTimeUtil';
import { findCommunityByPostID } from '../utils/FindCommunityByPostID.js';
import { getTotalCommentCount } from '../utils/GetTotalCommentCount.js';
import axios from 'axios';
import { useState, useEffect } from 'react';

function PostDetails(props) {
    const communityName = findCommunityByPostID(props.postID, props.communities);
    const post = props.posts.find(p => p._id === props.postID);
    const linkFlair = props.linkFlair.find(f => f._id === post.linkFlairID)?.content || '';

    const [upvoteCount, setUpvoteCount] = useState(null);

    const info = {
        postID: post._id
    }

    const getUpvotes = async (info) => {
        try {
            const res = await axios.post('http://localhost:8000/upvotes', info);
            setUpvoteCount(res.data.upvotes);
        } catch (error) {
            console.log("upvote count retrieval error " + error);
        }
    }

    useEffect(() => {
        getUpvotes(info);
        // eslint-disable-next-line
    }, [upvoteCount]);

    const incrementUpvote = async () => {
        try { 
            await axios.patch('http://localhost:8000/increment-upvote', info);
            setUpvoteCount(upvoteCount + 1);

        } catch (error) {
            console.log("increment upvote error" + error);
        }
    }

    const decrementUpvote = async () => {
        try { 
            await axios.patch('http://localhost:8000/decrement-upvote', info);
            setUpvoteCount(upvoteCount - 1);

        } catch (error) {
            console.log("decrement upvote error" + error);
        }
    }

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
                        <p><span className="bold">Upvotes: </span>{upvoteCount}</p>
                    </div>
                    {props.loggedIn ? (
                        <>
                        <button onClick={() => {
                            props.setView({type: 'create-comment', id: null});
                            props.setIsReply(false);
                            props.setCommentID('');
                            }}>Comment</button>
                        <button
                            style={{ margin: "0 10px" }}
                            onClick={incrementUpvote}>   
                            Upvote
                        </button>
                        <button 
                            onClick={decrementUpvote}>
                            Downvote
                        </button>
                        </>
                    ) : (
                        null
                    ) }
                    
                </div>
            </div>
        </div>
    );
}
export default PostDetails