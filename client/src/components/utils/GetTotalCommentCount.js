export function getTotalCommentCount(comments, commentIDs) {
    let count = commentIDs.length;

    commentIDs.forEach(commentID => {
        const comment = comments.find(c => c._id === commentID);
        if (comment && comment.commentIDs.length > 0) {
            count += getTotalCommentCount(comments, comment.commentIDs);
        }
    });
    return count;
  }