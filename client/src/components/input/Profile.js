import React, { useState } from "react";

export default function Profile(props) {
    const [activeTab, setActiveTab] = useState("posts");
    const handleTabChange = (tab) => setActiveTab(tab);
    const user = props.user;
    return (
        <>
            {/* User DisplayName <br />
            User Email   <br />
            Member since  <br />
            Reputation <br />
            Listing with buttons and links etc<br /> */}


            {/* User Info */}
            <h2>{user.displayName}</h2>
            <p>Email: {user.email}</p>
            {/* <p>Member since: {new Date(user.memberSince).toLocaleDateString()}</p> */}
            <p>Reputation: {user.reputation}</p>

            {/* Tabs for Listings */}
            <div>
                <button onClick={() => handleTabChange("communities")}>Communities</button>
                <button onClick={() => handleTabChange("posts")}>Posts</button>
                <button onClick={() => handleTabChange("comments")}>Comments</button>
            </div>

            {/* Listings */}
            {activeTab === "communities" && (
                <ol>
                    {props.userCommunities.map((community) => (
                        <li key={community._id}>
                            <span><a href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.setView({ type: 'edit-community', id: community._id });
                                }}>{community.name}</a></span>
                        </li>
                    ))}
                </ol>
            )}
            {/* {activeTab === "communities" && (
                <ul>
                    {communities.map((community) => (
                        <li key={community.id}>
                            <span>{community.name}</span>
                            <button onClick={() => onEdit("community", community.id)}>Edit</button>
                            <button onClick={() => onDelete("community", community.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            {activeTab === "posts" && (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <span>{post.title}</span>
                            <button onClick={() => onEdit("post", post.id)}>Edit</button>
                            <button onClick={() => onDelete("post", post.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            {activeTab === "comments" && (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <span>{comment.content.slice(0, 20)}...</span>
                            <button onClick={() => onEdit("comment", comment.id)}>Edit</button>
                            <button onClick={() => onDelete("comment", comment.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )} */}
        </>
    );
}

