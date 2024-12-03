import { formatTimestamp } from "../utils/FormatTimeUtil"; 

function CommentDetail({ commentIDs, comments, indentLevel = 0, setView, setIsReply, setCommentID }) {
    const filteredComments = comments.filter(comment => commentIDs.includes(comment._id));
    const sortedComments = [...filteredComments].sort((a, b) => {
        return new Date(b.commentedDate) - new Date(a.commentedDate);
    });

    return (
        <>
            {sortedComments.map((comment) => {
                return (
                    <div key={comment._id} className="comment" style={{ paddingLeft: `${indentLevel * 20}px` }}>
                        <p>
                            <span className="bold">{comment.commentedBy}</span>{" "}
                            {formatTimestamp(new Date(comment.commentedDate))}
                        </p>
                        <p style={{wordBreak:"break-all"}}>{comment.content}</p>
                        <button className="reply-btn" data-comment-id={comment.commentID} onClick={() => {
                                setView({type: 'create-comment', id: null});
                                setIsReply(true);
                                setCommentID(comment._id);
                            }}>
                            Reply
                        </button>
                        {comment.commentIDs && comment.commentIDs.length > 0 && (
                            <CommentDetail
                                commentIDs={comment.commentIDs}
                                comments={comments}
                                indentLevel={indentLevel + 1}
                                setView={setView}
                                setIsReply={setIsReply}
                                setCommentID={setCommentID}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
}

export default CommentDetail;