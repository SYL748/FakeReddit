import { formatTimestamp } from "../utils/FormatTimeUtil"; 
import axios from "axios";
import { useState, useEffect } from "react";


function CommentDetail({ commentIDs, comments, indentLevel = 0, setView, setIsReply, setCommentID, loggedIn }) {
    const filteredComments = comments.filter(comment => commentIDs.includes(comment._id));
    const sortedComments = [...filteredComments].sort((a, b) => {
        return new Date(b.commentedDate) - new Date(a.commentedDate);
    });

    const [upvotes, setUpvotes] = useState({});

    const getUpvotes = async (commentID) => {
        try {
            const res = await axios.post('http://localhost:8000/comment-upvotes', {commentID});
            setUpvotes((prevUpvotes) => ({
                ...prevUpvotes, [commentID]: res.data.upvotes,
            }));
        } catch (error) {
            console.log(error.response.data);
        }
    };

    useEffect(() => {
        commentIDs.forEach((id) => getUpvotes(id));
    }, [commentIDs]);

    const incrementCommentUpvote = async (commentID) => {
        try {
          await axios.patch('http://localhost:8000/increment-comment-upvote', {commentID});
          setUpvotes((prevUpvotes) => ({
            ...prevUpvotes,
            [commentID]: prevUpvotes[commentID] + 1,
          }));
        } catch (error) {
            console.log(error.response.data);
        }
      };
      
      const decrementCommentUpvote = async (commentID) => {
        try {
          await axios.patch('http://localhost:8000/decrement-comment-upvote', {commentID});
          setUpvotes((prevUpvotes) => ({
            ...prevUpvotes,
            [commentID]: prevUpvotes[commentID] - 1,
          }));
        } catch (error) {
            console.log(error.response.data);
        }
      };

return (
    <>
        {sortedComments.map((comment) => {
            return (
                <div key={comment._id} className="comment" style={{ paddingLeft: `${indentLevel * 20}px` }}>
                    <p>
                        <span className="bold">{comment.commentedBy}</span>{" commented "}
                        {formatTimestamp(new Date(comment.commentedDate))}
                        {` and has `}
                        <span className="bold">{upvotes[comment._id]} upvotes</span>
                    </p>
                    <p style={{ wordBreak: "break-all" }}>{comment.content}</p>
                    {loggedIn ? (
                        <div>
                            <button
                                className="reply-btn"
                                data-comment-id={comment.commentID}
                                onClick={() => {
                                    setView({ type: "create-comment", id: null });
                                    setIsReply(true);
                                    setCommentID(comment._id);
                                }}>
                                Reply
                            </button>
                            <button 
                            onClick={() => {incrementCommentUpvote(comment._id); console.log(comment._id)}}
                            style={{ margin: "0 10px" }}>
                                Upvote
                            </button>
                            <button
                            onClick={() => decrementCommentUpvote(comment._id)}>
                                Downvote
                            </button>
                        </div>
                    ) : (
                        null
                    )}
                    {comment.commentIDs && comment.commentIDs.length > 0 && (
                        <CommentDetail
                            commentIDs={comment.commentIDs}
                            comments={comments}
                            indentLevel={indentLevel + 1}
                            setView={setView}
                            setIsReply={setIsReply}
                            setCommentID={setCommentID}
                            loggedIn={loggedIn}
                        />
                    )}
                </div>
            );
        })}
    </>
);
}

export default CommentDetail;