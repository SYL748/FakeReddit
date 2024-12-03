export function findCommunityByPostID(postID, communities) {
    for (let community of communities) {
        if (community.postIDs.includes(postID)) {
          return community.name;
        }
    }
    return "Unknown Community";
}