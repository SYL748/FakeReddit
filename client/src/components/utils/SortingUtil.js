export function sortNewest(posts) {
    return [...posts].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
}

export function sortOldest(posts) {
    return [...posts].sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
}

export function getLatestCommentDate(comments, commentIDs) {
    let latestDate = new Date(0);
    commentIDs.forEach(commentID => {
        const comment = comments.find(c => c._id === commentID);
        if (comment) {
            const commentDate = new Date(comment.commentedDate);
            if (commentDate > latestDate) {
                latestDate = commentDate;
            }
            if (comment.commentIDs && comment.commentIDs.length > 0) {
                const latestReplyDate = getLatestCommentDate(comments, comment.commentIDs);
                if (latestReplyDate > latestDate) {
                    latestDate = latestReplyDate;
                }
            }
        }
    });
    return latestDate;
}

export function sortActive(comments, posts) {
    return [...posts].sort((a, b) => {
        const latestCommentA = getLatestCommentDate(comments, a.commentIDs);
        const latestCommentB = getLatestCommentDate(comments, b.commentIDs);

        if (latestCommentA > latestCommentB) return -1;
        if (latestCommentA < latestCommentB) return 1;

        const postDateA = new Date(a.postedDate);
        const postDateB = new Date(b.postedDate);
        return postDateB - postDateA;
    });
}