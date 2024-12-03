import ButtonList from "../general/ButtonList";
import Delimiter from "../general/Delimiter";
import PostList from "../posts/PostList";
import { formatTimestamp } from "../utils/FormatTimeUtil";
import './communitypage.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

function CommunityPage(props) {
    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8000/communities/${props.communityID}`);
                setCommunity(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching community:', error);
            }
        };

        fetchCommunity();
    }, [props.communityID]);

    if (loading) {
        return <div>bruh.</div>;
    }

    const communityPosts = props.posts.filter(post => community?.postIDs?.includes(post._id));

    return (
        <div className="community-view">
            <div className="community-header">
            <div className="community-desc">
                <h2>{community.name}</h2>
                <p>{community.description}</p>
                <p>Community formed {formatTimestamp(new Date(community.startDate))}</p>
                <p>{community.postIDs.length} posts made by {community.members.length} members in the community!</p>
            </div>
            <ButtonList posts={props.posts} setPosts={props.setPosts} comments={props.comments}/>
        </div>
            <Delimiter />
            <PostList posts={communityPosts} setView={props.setView} comments={props.comments} communities={props.communities} linkFlair={props.linkFlair} currentView={props.currentView}/>
        </div>
    );
    
    
}

export default CommunityPage