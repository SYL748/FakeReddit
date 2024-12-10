import './postinfocard.css'
import { formatTimestamp } from "../utils/FormatTimeUtil";
import { getTotalCommentCount } from "../utils/GetTotalCommentCount";
import { findCommunityByPostID } from "../utils/FindCommunityByPostID";
import axios from 'axios';
import { useState, useEffect } from 'react';

function PostInfoCard(props) {
    console.log(props.post);
    console.log(props.post.content);


    const [upvoteCount, setUpvoteCount] = useState(null);
    const linkFlairContent = props.linkFlair.find(f => f._id === props.post.linkFlairID)?.content || '';
    const shortContent = props.post.content.length > 80 ? props.post.content.substring(0, 80) + "..." : props.post.content;

    const info = {
        postID: props.post._id
    }

    const updateViews = async (info) => {
        try {
            console.log("updating views");
            const res = await axios.patch('http://localhost:8000/views', info);
            console.log(res);
        } catch (error) {
            console.log("error in post client" + error);
        }
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
    }, []);

    let inCommunity = false;
    console.log(props.currentView);
    if (props.currentView.type === 'community') {
        inCommunity = true;
    }

    return (
        <div className="post-info-card">
            <div className="post-card-heading">
                {
                    !inCommunity ? (<p><span className="bold">Community: </span>{findCommunityByPostID(props.post._id, props.communities)}</p>) : ''
                }
                <p><span className="bold">Posted by </span>{props.post.postedBy}</p>
                <p><span className="bold">Posted </span>{formatTimestamp(new Date(props.post.postedDate))}</p>
            </div>
            <div className="post-body">
                <h3><a href="/" onClick={(e) => {
                    e.preventDefault();
                    props.setView({type:"post", id:props.post._id});
                    updateViews(info);
                }}>{props.post.title}</a></h3>
                {linkFlairContent ? <p><span className="bold">Link Flair: </span>{linkFlairContent}</p> : ''}
                <p><span className="bold">Content: </span>{shortContent}</p>
            </div>
            <div className="post-footer">
                <div className="views-comments">
                    <p><span className="bold">Views: </span>{props.post.views}</p>
                    <p><span className="bold">Comments: </span>{getTotalCommentCount(props.comments, props.post.commentIDs)}</p>
                    <p><span className="bold">Upvotes: </span>{upvoteCount}</p>
                </div>
            </div>
        </div>
    );
}

export default PostInfoCard