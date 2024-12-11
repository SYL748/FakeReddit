import React, { useState } from "react";

export default function Profile(props) {
    const [activeTab, setActiveTab] = useState("posts");
    const handleTabChange = (tab) => setActiveTab(tab);
    const user = props.user;
    console.log(props.userComments);
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
            {activeTab === "posts" && (
                <ol>
                    {props.userPosts.map((post) => (
                        <li key={post._id}>
                            <span>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.setView({ type: 'edit-post', id: post._id });
                                    }}
                                >
                                    {post.title}
                                </a>
                            </span>
                        </li>
                    ))}
                </ol>
            )}

            {activeTab === "comments" && (
                <ul>
                    {props.userComments.map((c) => (
                        <li key={c._id}>
                            <span>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        props.setView({ type: "edit-comment", id: c._id });
                                    }}
                                >
                                    {c.content.slice(0,20)}...
                                </a>
                            </span>
                        </li>
                    ))}
                </ul>
            )}

        </>
    );
}

