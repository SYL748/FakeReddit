export function searchPostsAndComments(query, posts, comments) {
    const queryWords = query.split(' ').map(word => word.trim());
    const seenPosts = new Set();
    const seenComments = new Set();

    // Helper function to search comments recursively
    function checkCommentAndReplies(commentID, postID) {
        if (seenComments.has(commentID)) return false;
        const comment = comments.find(c => c._id === commentID);
        if (comment && comment.content) {
            seenComments.add(commentID);
            const commentMatches = queryWords.some(word => comment.content.includes(word));
            if (commentMatches && !seenPosts.has(postID)) {
                seenPosts.add(postID);
            }
            if (comment.commentIDs && comment.commentIDs.length > 0) {
                comment.commentIDs.forEach(replyID => checkCommentAndReplies(replyID, postID));
            }
        }
    }
    // Search through posts
    posts.forEach(post => {
        const matches = queryWords.some(word => post.title.includes(word) || post.content.includes(word));
        if (matches) {
            seenPosts.add(post._id);
        }
        post.commentIDs.forEach(commentID => checkCommentAndReplies(commentID, post._id));
    });
    return Array.from(seenPosts).map(postID => posts.find(p => p._id === postID));
}